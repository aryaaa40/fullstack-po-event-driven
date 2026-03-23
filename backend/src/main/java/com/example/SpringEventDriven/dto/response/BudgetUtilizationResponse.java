package com.example.SpringEventDriven.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BudgetUtilizationResponse {

    private DepartmentResponse department;
    private Integer fiscalYear;

    private BigDecimal totalBudget;    // dari tabel budgets
    private BigDecimal utilized;       // SUM(amount) PO FINANCE_APPROVED
    private BigDecimal committed;      // SUM(amount) PO PENDING + MANAGER_APPROVED
    private BigDecimal available;      // totalBudget - utilized - committed

    // Persentase utilized dari total budget (0-100), null jika totalBudget = 0
    private Double utilizationPercent;
}
