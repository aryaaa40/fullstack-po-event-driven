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

    @Query("SELECT po.category as category, SUM(po.amount) as amount FROM PurchaseOrder po " +
           "WHERE po.status = 'FINANCE_APPROVED' GROUP BY po.category")
    List<Object[]> getSpendingByCategory();

    @Query("SELECT po.category as category, SUM(po.amount) as amount FROM PurchaseOrder po " +
           "WHERE po.status = 'FINANCE_APPROVED' AND po.department.id = :deptId GROUP BY po.category")
    List<Object[]> getSpendingByCategoryAndDepartment(@Param("deptId") Long deptId);

    @Query(value = "SELECT TO_CHAR(created_at, 'Mon') as month, SUM(amount) as total " +
                   "FROM purchase_orders " +
                   "WHERE status = 'FINANCE_APPROVED' " +
                   "GROUP BY month, DATE_TRUNC('month', created_at) " +
                   "ORDER BY DATE_TRUNC('month', created_at)", nativeQuery = true)
    List<Object[]> getMonthlySpendingTrend();

    @Query(value = "SELECT TO_CHAR(created_at, 'Mon') as month, SUM(amount) as total " +
                   "FROM purchase_orders " +
                   "WHERE status = 'FINANCE_APPROVED' AND department_id = :deptId " +
                   "GROUP BY month, DATE_TRUNC('month', created_at) " +
                   "ORDER BY DATE_TRUNC('month', created_at)", nativeQuery = true)
    List<Object[]> getMonthlySpendingTrendByDepartment(@Param("deptId") Long deptId);

    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.status = 'FINANCE_APPROVED'")
    long countApprovedOrders();

    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.status = 'FINANCE_APPROVED' AND po.department.id = :deptId")
    long countApprovedOrdersByDepartment(@Param("deptId") Long deptId);

    @Query("SELECT COALESCE(SUM(po.amount), 0) FROM PurchaseOrder po WHERE po.status = 'FINANCE_APPROVED'")
    BigDecimal sumTotalApprovedAmount();

    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.department.id = :deptId")
    long countByDepartmentId(@Param("deptId") Long deptId);

    @Query("SELECT COALESCE(SUM(po.amount), 0) FROM PurchaseOrder po WHERE po.department.id = :deptId AND po.status IN :statuses")
    BigDecimal sumAmountByDepartmentAndStatuses(@Param("deptId") Long deptId, @Param("statuses") List<PurchaseOrderStatus> statuses);
}
