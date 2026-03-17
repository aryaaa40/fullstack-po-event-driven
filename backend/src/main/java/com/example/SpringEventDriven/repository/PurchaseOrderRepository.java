package com.example.SpringEventDriven.repository;

import com.example.SpringEventDriven.entity.PurchaseOrder;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findByStatus(PurchaseOrderStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findByCreatedBy_Id(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findByCreatedBy_IdAndStatus(Long userId, PurchaseOrderStatus status, Pageable pageable);
}
