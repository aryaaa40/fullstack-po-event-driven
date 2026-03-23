package com.example.SpringEventDriven.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BudgetResponse {

    private Long id;
    private DepartmentResponse department;
    private Integer fiscalYear;
    private Integer fiscalMonth;
    private BigDecimal totalAmount;
    private String createdBy;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
