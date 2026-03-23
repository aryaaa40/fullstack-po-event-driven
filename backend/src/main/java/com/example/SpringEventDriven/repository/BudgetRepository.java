package com.example.SpringEventDriven.repository;

import com.example.SpringEventDriven.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Cari budget tahunan (fiscal_month = null) untuk dept tertentu
    Optional<Budget> findByDepartmentIdAndFiscalYearAndFiscalMonthIsNull(Long departmentId, Integer fiscalYear);

    // Semua budget suatu dept (semua tahun)
    List<Budget> findByDepartmentIdOrderByFiscalYearDesc(Long departmentId);

    // Semua budget tahun tertentu (untuk Finance lihat semua dept)
    @Query("SELECT b FROM Budget b JOIN FETCH b.department WHERE b.fiscalYear = :year AND b.fiscalMonth IS NULL")
    List<Budget> findAllAnnualByFiscalYear(@Param("year") Integer fiscalYear);
}
