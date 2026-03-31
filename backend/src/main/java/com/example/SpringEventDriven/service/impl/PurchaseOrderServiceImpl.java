package com.example.SpringEventDriven.service.impl;

import com.example.SpringEventDriven.dto.request.CreatePurchaseOrderItemRequest;
import com.example.SpringEventDriven.dto.request.CreatePurchaseOrderRequest;
import com.example.SpringEventDriven.dto.response.DepartmentResponse;
import com.example.SpringEventDriven.dto.response.PurchaseOrderItemResponse;
import com.example.SpringEventDriven.dto.response.PurchaseOrderResponse;
import com.example.SpringEventDriven.entity.Department;
import com.example.SpringEventDriven.entity.POCategory;
import com.example.SpringEventDriven.entity.POPriority;
import com.example.SpringEventDriven.entity.PurchaseOrder;
import com.example.SpringEventDriven.entity.PurchaseOrderItem;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.Role;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.event.PurchaseOrderEvent;
import com.example.SpringEventDriven.repository.BudgetRepository;
import com.example.SpringEventDriven.repository.DepartmentRepository;
import com.example.SpringEventDriven.repository.PurchaseOrderRepository;
import com.example.SpringEventDriven.service.PurchaseOrderEventPublisher;
import com.example.SpringEventDriven.service.PurchaseOrderService;
import com.example.SpringEventDriven.specification.PurchaseOrderSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final DepartmentRepository departmentRepository;
    private final BudgetRepository budgetRepository;
    private final PurchaseOrderEventPublisher eventPublisher;

    private static final int MAX_PAGE_SIZE = 50;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "amount", "status", "title");

    @Override
    public PurchaseOrderResponse create(CreatePurchaseOrderRequest request, User currentUser) {
        // Hitung total dari items jika ada; fallback ke request.amount
        List<PurchaseOrderItem> itemEntities = new ArrayList<>();
        BigDecimal totalAmount;

        boolean hasItems = request.getItems() != null && !request.getItems().isEmpty();

        if (hasItems) {
            totalAmount = BigDecimal.ZERO;
            for (CreatePurchaseOrderItemRequest itemReq : request.getItems()) {
                BigDecimal subtotal = itemReq.getUnitPrice()
                        .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
                itemEntities.add(PurchaseOrderItem.builder()
                        .itemName(itemReq.getItemName())
                        .quantity(itemReq.getQuantity())
                        .unitPrice(itemReq.getUnitPrice())
                        .subtotal(subtotal)
                        .build());
                totalAmount = totalAmount.add(subtotal);
            }
        } else {
            if (request.getAmount() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Amount is required when no items are provided");
            }
            totalAmount = request.getAmount();
        }

        // Priority: Use department from currentUser if available, otherwise from request
        Department department = currentUser.getDepartment();
        if (department == null && request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
        }

        if (department == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User department not found. Please ensure your profile is assigned to a department.");
        }

        // VALIDATION: Ensure department has a budget for the current fiscal year
        int currentYear = LocalDate.now().getYear();
        boolean budgetExists = budgetRepository.findByDepartmentIdAndFiscalYearAndFiscalMonthIsNull(
                department.getId(), currentYear).isPresent();

        if (!budgetExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Department [" + department.getName() + "] does not have an allocated budget for fiscal year " + currentYear +
                    ". Technical Note: Please check Budget table in DB for year " + currentYear);
        }

        PurchaseOrder po = PurchaseOrder.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(totalAmount)
                .category(request.getCategory())
                .department(department)
                .priority(request.getPriority() != null ? request.getPriority() : POPriority.NORMAL)
                .justification(request.getJustification())
                .vendor(request.getVendor())
                .requiredDate(request.getRequiredDate())
                .deliveryAddress(request.getDeliveryAddress())
                .currency(request.getCurrency() != null ? request.getCurrency() : "IDR")
                .budgetCode(request.getBudgetCode())
                .paymentTerms(request.getPaymentTerms())
                .notes(request.getNotes())
                .createdBy(currentUser)
                .build();

        // Link items ke PO
        for (PurchaseOrderItem item : itemEntities) {
            item.setPurchaseOrder(po);
            po.getItems().add(item);
        }

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        publishEvent(saved, currentUser.getUsername(), null); // fromStatus null = baru dibuat
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PurchaseOrderResponse> getList(
            PurchaseOrderStatus status,
            String search,
            POCategory category,
            POPriority priority,
            LocalDate dateFrom,
            LocalDate dateTo,
            int page, int size, String sortBy,
            User currentUser) {

        int safeSize = Math.min(size, MAX_PAGE_SIZE);
        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";
        Pageable pageable = PageRequest.of(page, safeSize, Sort.by(Sort.Direction.DESC, safeSortBy));

        boolean isRequester = currentUser.getRole() == Role.REQUESTER;
        boolean isManager   = currentUser.getRole() == Role.MANAGER;

        Long filterByUserId = isRequester ? currentUser.getId() : null;
        Long filterByDeptId = isManager && currentUser.getDepartment() != null
                ? currentUser.getDepartment().getId() : null;

        Specification<PurchaseOrder> spec = PurchaseOrderSpecification.withFilters(
                search, status, category, priority, dateFrom, dateTo,
                isRequester, filterByUserId, filterByDeptId
        );

        return purchaseOrderRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(Long id, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));

        boolean isRequester = currentUser.getRole() == Role.REQUESTER;
        if (isRequester && !po.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return toResponse(po);
    }

    @Override
    public PurchaseOrderResponse approve(Long id, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));

        if (po.getStatus() != PurchaseOrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING purchase orders can be approved by manager");
        }
        validateManagerDepartment(po, currentUser);

        po.setStatus(PurchaseOrderStatus.MANAGER_APPROVED);
        PurchaseOrder saved = purchaseOrderRepository.save(po);
        publishEvent(saved, currentUser.getUsername(), PurchaseOrderStatus.PENDING);
        return toResponse(saved);
    }

    @Override
    public PurchaseOrderResponse reject(Long id, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));

        if (po.getStatus() != PurchaseOrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING purchase orders can be rejected by manager");
        }
        validateManagerDepartment(po, currentUser);

        po.setStatus(PurchaseOrderStatus.REJECTED);
        PurchaseOrder saved = purchaseOrderRepository.save(po);
        publishEvent(saved, currentUser.getUsername(), PurchaseOrderStatus.PENDING);
        return toResponse(saved);
    }

    @Override
    public PurchaseOrderResponse financeApprove(Long id, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));

        if (po.getStatus() != PurchaseOrderStatus.MANAGER_APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only MANAGER_APPROVED purchase orders can be approved by finance");
        }

        po.setStatus(PurchaseOrderStatus.FINANCE_APPROVED);
        PurchaseOrder saved = purchaseOrderRepository.save(po);
        publishEvent(saved, currentUser.getUsername(), PurchaseOrderStatus.MANAGER_APPROVED);
        return toResponse(saved);
    }

    @Override
    public PurchaseOrderResponse financeReject(Long id, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));

        if (po.getStatus() != PurchaseOrderStatus.MANAGER_APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only MANAGER_APPROVED purchase orders can be rejected by finance");
        }

        po.setStatus(PurchaseOrderStatus.REJECTED);
        PurchaseOrder saved = purchaseOrderRepository.save(po);
        publishEvent(saved, currentUser.getUsername(), PurchaseOrderStatus.MANAGER_APPROVED);
        return toResponse(saved);
    }

    private DepartmentResponse toDepartmentResponse(Department dept) {
        if (dept == null) return null;
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .createdAt(dept.getCreatedAt())
                .build();
    }

    private PurchaseOrderResponse toResponse(PurchaseOrder po) {
        List<PurchaseOrderItemResponse> itemResponses = po.getItems().stream()
                .map(item -> PurchaseOrderItemResponse.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        return PurchaseOrderResponse.builder()
                .id(po.getId())
                .title(po.getTitle())
                .description(po.getDescription())
                .amount(po.getAmount())
                .status(po.getStatus())
                .category(po.getCategory())
                .department(toDepartmentResponse(po.getDepartment()))
                .priority(po.getPriority())
                .justification(po.getJustification())
                .vendor(po.getVendor())
                .requiredDate(po.getRequiredDate())
                .deliveryAddress(po.getDeliveryAddress())
                .currency(po.getCurrency())
                .budgetCode(po.getBudgetCode())
                .paymentTerms(po.getPaymentTerms())
                .notes(po.getNotes())
                .items(itemResponses)
                .createdByUsername(po.getCreatedBy().getUsername())
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt())
                .build();
    }

    private void validateManagerDepartment(PurchaseOrder po, User manager) {
        if (manager.getRole() != Role.MANAGER) return;
        if (manager.getDepartment() == null || po.getDepartment() == null) return;
        if (!manager.getDepartment().getId().equals(po.getDepartment().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can only approve/reject purchase orders from your own department");
        }
    }

    private void publishEvent(PurchaseOrder po, String actorUsername, PurchaseOrderStatus fromStatus) {
        try {
            eventPublisher.publishStatusChanged(
                    PurchaseOrderEvent.builder()
                            .poId(po.getId())
                            .fromStatus(fromStatus)
                            .newStatus(po.getStatus())
                            .actorUsername(actorUsername)
                            .requesterUsername(po.getCreatedBy().getUsername())
                            .timestamp(LocalDateTime.now())
                            .build()
            );
        } catch (Exception e) {
            // Log exception, but do not rollback transaction if RabbitMQ fails
        }
    }
}
