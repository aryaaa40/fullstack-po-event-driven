package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.dto.response.ApprovalHistoryResponse;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.event.PurchaseOrderEvent;

import java.util.List;

public interface ApprovalHistoryService {

    // Dipanggil oleh ApprovalHistoryListener saat ada event masuk dari RabbitMQ
    void recordHistory(PurchaseOrderEvent event);

    // Dipanggil oleh PurchaseOrderController untuk GET /purchase-orders/{id}/history
    List<ApprovalHistoryResponse> getHistoryByPoId(Long poId, User currentUser);

    // Dipanggil oleh ActivityController untuk GET /activity/recent
    List<ApprovalHistoryResponse> getRecentActivity(User currentUser);
}
