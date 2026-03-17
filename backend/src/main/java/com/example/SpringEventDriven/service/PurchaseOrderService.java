package com.example.SpringEventDriven.service;

import org.springframework.data.domain.Page;

import com.example.SpringEventDriven.dto.request.CreatePurchaseOrderRequest;
import com.example.SpringEventDriven.dto.response.PurchaseOrderResponse;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.User;

public interface PurchaseOrderService {
    PurchaseOrderResponse create(CreatePurchaseOrderRequest request, User currentUser);

    Page<PurchaseOrderResponse> getList(PurchaseOrderStatus status, int page, int size, String sortBy, User currentUser);

    PurchaseOrderResponse getById(Long id, User currentUser);
}
