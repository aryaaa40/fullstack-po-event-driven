package com.example.SpringEventDriven.controller;

import com.example.SpringEventDriven.dto.request.CreatePurchaseOrderRequest;
import com.example.SpringEventDriven.dto.response.ApiResponse;
import com.example.SpringEventDriven.dto.response.PageResponse;
import com.example.SpringEventDriven.dto.response.PurchaseOrderResponse;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> create(
            @Valid @RequestBody CreatePurchaseOrderRequest request,
            @AuthenticationPrincipal User currentUser) {

        PurchaseOrderResponse result = purchaseOrderService.create(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Purchase order created successfully", result));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('REQUESTER', 'MANAGER', 'FINANCE')")
    public ResponseEntity<ApiResponse<PageResponse<PurchaseOrderResponse>>> getList(
            @RequestParam(required = false) PurchaseOrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @AuthenticationPrincipal User currentUser) {

        Page<PurchaseOrderResponse> result = purchaseOrderService.getList(status, page, size, sortBy, currentUser);
        return ResponseEntity.ok(ApiResponse.success(200, "Purchase orders retrieved successfully", PageResponse.of(result)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('REQUESTER', 'MANAGER', 'FINANCE')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        PurchaseOrderResponse result = purchaseOrderService.getById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(200, "Purchase order retrieved successfully", result));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        PurchaseOrderResponse result = purchaseOrderService.approve(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(200, "Purchase order approved by manager", result));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        PurchaseOrderResponse result = purchaseOrderService.reject(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(200, "Purchase order rejected by manager", result));
    }

    @PatchMapping("/{id}/finance-approve")
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> financeApprove(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        PurchaseOrderResponse result = purchaseOrderService.financeApprove(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(200, "Purchase order approved by finance", result));
    }

    @PatchMapping("/{id}/finance-reject")
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> financeReject(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        PurchaseOrderResponse result = purchaseOrderService.financeReject(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(200, "Purchase order rejected by finance", result));
    }

}
