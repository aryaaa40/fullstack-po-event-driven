package com.example.SpringEventDriven.dto.response;

import com.example.SpringEventDriven.entity.POCategory;
import com.example.SpringEventDriven.entity.POPriority;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@JsonPropertyOrder({
    "id", "title", "description", "amount", "status",
    "category", "department", "priority",
    "justification", "vendor", "requiredDate", "deliveryAddress",
    "currency", "budgetCode", "paymentTerms", "notes",
    "items", "createdByUsername", "createdAt", "updatedAt"
})
public class PurchaseOrderResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private PurchaseOrderStatus status;

    // New fields
    private POCategory category;
    private DepartmentResponse department;
    private POPriority priority;
    private String justification;
    private String vendor;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate requiredDate;

    private String deliveryAddress;
    private String currency;
    private String budgetCode;
    private String paymentTerms;
    private String notes;

    private List<PurchaseOrderItemResponse> items;

    private String createdByUsername;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
