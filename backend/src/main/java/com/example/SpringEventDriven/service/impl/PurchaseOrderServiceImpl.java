package com.example.SpringEventDriven.service.impl;

import com.example.SpringEventDriven.dto.request.CreatePurchaseOrderRequest;
import com.example.SpringEventDriven.dto.response.PurchaseOrderResponse;
import com.example.SpringEventDriven.entity.PurchaseOrder;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.Role;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.repository.PurchaseOrderRepository;
import com.example.SpringEventDriven.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    private static final int MAX_PAGE_SIZE = 50;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "amount", "status", "title");

    @Override
    public PurchaseOrderResponse create(CreatePurchaseOrderRequest request, User currentUser) {
        PurchaseOrder po = PurchaseOrder.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .createdBy(currentUser)
                .build();

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        return toResponse(saved);
    }

    @Override
    public Page<PurchaseOrderResponse> getList(PurchaseOrderStatus status, int page, int size, String sortBy, User currentUser) {
        
        int safeSize = Math.min(size, MAX_PAGE_SIZE);

        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";

        Pageable pageable = PageRequest.of(page, safeSize, Sort.by(Sort.Direction.DESC, safeSortBy));

        boolean isRequester = currentUser.getRole() == Role.REQUESTER;

        if (isRequester && status != null) {
            return purchaseOrderRepository
                    .findByCreatedBy_IdAndStatus(currentUser.getId(), status, pageable)
                    .map(this::toResponse);
        } else if (isRequester) {
            return purchaseOrderRepository
                    .findByCreatedBy_Id(currentUser.getId(), pageable)
                    .map(this::toResponse);
        } else if (status != null) {
            return purchaseOrderRepository
                    .findByStatus(status, pageable)
                    .map(this::toResponse);
        } else {
            return purchaseOrderRepository
                    .findAll(pageable)
                    .map(this::toResponse);
        }
    }

    @Override
    public PurchaseOrderResponse getById(Long id, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));

        boolean isRequester = currentUser.getRole() == Role.REQUESTER;
        if (isRequester && !po.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return toResponse(po);
    }

    private PurchaseOrderResponse toResponse(PurchaseOrder po) {
        return PurchaseOrderResponse.builder()
                .id(po.getId())
                .title(po.getTitle())
                .description(po.getDescription())
                .amount(po.getAmount())
                .status(po.getStatus())
                .createdByUsername(po.getCreatedBy().getUsername())
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt())
                .build();
    }
}
