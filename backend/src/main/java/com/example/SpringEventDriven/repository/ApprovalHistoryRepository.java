package com.example.SpringEventDriven.repository;

import com.example.SpringEventDriven.entity.ApprovalHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalHistoryRepository extends JpaRepository<ApprovalHistory, Long> {

    // Untuk endpoint GET /purchase-orders/{id}/history
    // EntityGraph eager-load purchaseOrder supaya tidak N+1 saat mapping ke response
    @EntityGraph(attributePaths = "purchaseOrder")
    List<ApprovalHistory> findByPurchaseOrder_IdOrderByCreatedAtAsc(Long poId);

    // Untuk recent activity — semua role (MANAGER, FINANCE)
    @EntityGraph(attributePaths = {"purchaseOrder", "purchaseOrder.createdBy"})
    List<ApprovalHistory> findTop10ByOrderByCreatedAtDesc();

    // Untuk recent activity — REQUESTER (hanya PO miliknya sendiri)
    @EntityGraph(attributePaths = {"purchaseOrder", "purchaseOrder.createdBy"})
    List<ApprovalHistory> findTop10ByPurchaseOrder_CreatedBy_IdOrderByCreatedAtDesc(Long userId);
}
