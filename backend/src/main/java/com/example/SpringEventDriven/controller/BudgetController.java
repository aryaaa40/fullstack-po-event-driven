package com.example.SpringEventDriven.controller;

import com.example.SpringEventDriven.dto.request.BudgetRequest;
import com.example.SpringEventDriven.dto.response.ApiResponse;
import com.example.SpringEventDriven.dto.response.BudgetResponse;
import com.example.SpringEventDriven.dto.response.BudgetUtilizationResponse;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    // Finance: lihat semua budget per tahun
    @GetMapping
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAll(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") Integer fiscalYear) {
        return ResponseEntity.ok(ApiResponse.success(200, "Budgets retrieved successfully",
                budgetService.getAll(fiscalYear)));
    }

    @PostMapping
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<BudgetResponse>> create(
            @Valid @RequestBody BudgetRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Budget created successfully",
                        budgetService.create(request, currentUser)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<BudgetResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(ApiResponse.success(200, "Budget updated successfully",
                budgetService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(200, "Budget deleted successfully", null));
    }

    // Utilization — Finance lihat semua, Manager/Requester lihat dept sendiri
    @GetMapping("/utilization")
    @PreAuthorize("hasAnyRole('REQUESTER', 'MANAGER', 'FINANCE')")
    public ResponseEntity<ApiResponse<List<BudgetUtilizationResponse>>> getUtilization(
            @RequestParam(required = false) Integer fiscalYear,
            @AuthenticationPrincipal User currentUser) {

        int year = fiscalYear != null ? fiscalYear : LocalDate.now().getYear();
        return ResponseEntity.ok(ApiResponse.success(200, "Budget utilization retrieved successfully",
                budgetService.getUtilization(year, currentUser)));
    }
}
