package com.example.SpringEventDriven.service;

import org.springframework.data.domain.Page;

import com.example.SpringEventDriven.dto.request.CreatePurchaseOrderRequest;
import com.example.SpringEventDriven.dto.response.PurchaseOrderResponse;
import com.example.SpringEventDriven.entity.POCategory;
import com.example.SpringEventDriven.entity.POPriority;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.User;

import java.time.LocalDate;

public interface PurchaseOrderService {
    PurchaseOrderResponse create(CreatePurchaseOrderRequest request, User currentUser);

    Page<PurchaseOrderResponse> getList(
            PurchaseOrderStatus status,
            String search,
            POCategory category,
            POPriority priority,
            LocalDate dateFrom,
            LocalDate dateTo,
            int page, int size, String sortBy,
            User currentUser);

    PurchaseOrderResponse getById(Long id, User currentUser);

    PurchaseOrderResponse approve(Long id, User currentUser);

    PurchaseOrderResponse reject(Long id, User currentUser);

    PurchaseOrderResponse financeApprove(Long id, User currentUser);

    PurchaseOrderResponse financeReject(Long id, User currentUser);

}
