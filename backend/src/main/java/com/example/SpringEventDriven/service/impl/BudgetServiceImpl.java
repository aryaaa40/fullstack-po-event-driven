package com.example.SpringEventDriven.service.impl;

import com.example.SpringEventDriven.dto.request.BudgetRequest;
import com.example.SpringEventDriven.dto.response.BudgetResponse;
import com.example.SpringEventDriven.dto.response.BudgetUtilizationResponse;
import com.example.SpringEventDriven.dto.response.DepartmentResponse;
import com.example.SpringEventDriven.entity.Budget;
import com.example.SpringEventDriven.entity.Department;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.Role;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.repository.BudgetRepository;
import com.example.SpringEventDriven.repository.DepartmentRepository;
import com.example.SpringEventDriven.repository.PurchaseOrderRepository;
import com.example.SpringEventDriven.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final DepartmentRepository departmentRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Override
    public BudgetResponse create(BudgetRequest request, User currentUser) {
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));

        // Cek duplikat — satu budget per dept per tahun (per bulan jika pakai monthly)
        budgetRepository.findByDepartmentIdAndFiscalYearAndFiscalMonthIsNull(
                dept.getId(), request.getFiscalYear())
                .ifPresent(b -> { throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Budget for this department and fiscal year already exists"); });

        Budget budget = Budget.builder()
                .department(dept)
                .fiscalYear(request.getFiscalYear())
                .fiscalMonth(request.getFiscalMonth())
                .totalAmount(request.getTotalAmount())
                .createdBy(currentUser.getUsername())
                .build();

        return toResponse(budgetRepository.save(budget));
    }

    @Override
    public BudgetResponse update(Long id, BudgetRequest request) {
        Budget budget = findOrThrow(id);
        budget.setTotalAmount(request.getTotalAmount());
        return toResponse(budgetRepository.save(budget));
    }

    @Override
    public void delete(Long id) {
        budgetRepository.delete(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getAll(Integer fiscalYear) {
        return budgetRepository.findAllAnnualByFiscalYear(fiscalYear).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetUtilizationResponse> getUtilization(Integer fiscalYear, User currentUser) {
        List<Budget> budgets;

        if (currentUser.getRole() == Role.FINANCE) {
            // Finance: lihat semua departemen
            budgets = budgetRepository.findAllAnnualByFiscalYear(fiscalYear);
        } else {
            // Manager / Requester: hanya dept sendiri
            if (currentUser.getDepartment() == null) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User has no department assigned");
            }
            var found = budgetRepository.findByDepartmentIdAndFiscalYearAndFiscalMonthIsNull(
                    currentUser.getDepartment().getId(), fiscalYear);
            if (found.isEmpty()) return List.of();
            budgets = List.of(found.get());
        }

        return budgets.stream()
                .map(b -> buildUtilization(b, fiscalYear))
                .toList();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private BudgetUtilizationResponse buildUtilization(Budget budget, Integer fiscalYear) {
        Long deptId = budget.getDepartment().getId();

        BigDecimal utilized = purchaseOrderRepository
                .sumAmountByDepartmentAndStatus(deptId, PurchaseOrderStatus.FINANCE_APPROVED);
        BigDecimal committed = purchaseOrderRepository
                .sumAmountByDepartmentAndStatuses(deptId,
                        List.of(PurchaseOrderStatus.PENDING, PurchaseOrderStatus.MANAGER_APPROVED));

        if (utilized == null) utilized = BigDecimal.ZERO;
        if (committed == null) committed = BigDecimal.ZERO;

        BigDecimal total = budget.getTotalAmount();
        BigDecimal available = total.subtract(utilized).subtract(committed);

        Double utilizationPercent = null;
        if (total.compareTo(BigDecimal.ZERO) > 0) {
            utilizationPercent = utilized.divide(total, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        return BudgetUtilizationResponse.builder()
                .department(toDepartmentResponse(budget.getDepartment()))
                .fiscalYear(fiscalYear)
                .totalBudget(total)
                .utilized(utilized)
                .committed(committed)
                .available(available)
                .utilizationPercent(utilizationPercent)
                .build();
    }

    private Budget findOrThrow(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Budget not found"));
    }

    private BudgetResponse toResponse(Budget b) {
        return BudgetResponse.builder()
                .id(b.getId())
                .department(toDepartmentResponse(b.getDepartment()))
                .fiscalYear(b.getFiscalYear())
                .fiscalMonth(b.getFiscalMonth())
                .totalAmount(b.getTotalAmount())
                .createdBy(b.getCreatedBy())
                .createdAt(b.getCreatedAt())
                .build();
    }

    private DepartmentResponse toDepartmentResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
