package com.example.SpringEventDriven.repository;

import com.example.SpringEventDriven.entity.PurchaseOrder;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long>,
        JpaSpecificationExecutor<PurchaseOrder> {

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findAll(Pageable pageable);

    // Override dari JpaSpecificationExecutor — ditambah @EntityGraph agar tidak N+1
    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findAll(Specification<PurchaseOrder> spec, Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findByStatus(PurchaseOrderStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findByCreatedBy_Id(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = "createdBy")
    Page<PurchaseOrder> findByCreatedBy_IdAndStatus(Long userId, PurchaseOrderStatus status, Pageable pageable);

    // Untuk kalkulasi budget utilization
    @Query("SELECT COALESCE(SUM(po.amount), 0) FROM PurchaseOrder po WHERE po.department.id = :deptId AND po.status = :status")
    BigDecimal sumAmountByDepartmentAndStatus(@Param("deptId") Long deptId, @Param("status") PurchaseOrderStatus status);

    @Query("SELECT COALESCE(SUM(po.amount), 0) FROM PurchaseOrder po WHERE po.department.id = :deptId AND po.status IN :statuses")
    BigDecimal sumAmountByDepartmentAndStatuses(@Param("deptId") Long deptId, @Param("statuses") List<PurchaseOrderStatus> statuses);
}
