package com.example.SpringEventDriven.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Fiscal year is required")
    @Min(value = 2000, message = "Fiscal year must be >= 2000")
    private Integer fiscalYear;

    // Nullable — null berarti budget tahunan
    @Min(value = 1, message = "Fiscal month must be between 1 and 12")
    @Max(value = 12, message = "Fiscal month must be between 1 and 12")
    private Integer fiscalMonth;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;
}
