package com.example.SpringEventDriven.dto.request;

import com.example.SpringEventDriven.entity.POCategory;
import com.example.SpringEventDriven.entity.POPriority;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreatePurchaseOrderRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    // amount wajib jika items kosong/null; jika items ada, dihitung otomatis dari subtotal items
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private POCategory category;

    @NotNull(message = "Department is required")
    private Long departmentId;

    private POPriority priority; // default NORMAL jika null

    private String justification;

    @NotBlank(message = "Vendor is required")
    private String vendor;

    @NotNull(message = "Required date is required")
    private LocalDate requiredDate;

    private String deliveryAddress;

    private String currency; // default IDR jika null

    private String budgetCode;

    private String paymentTerms;

    private String notes;

    @Valid
    @NotEmpty(message = "At least one item is required")
    private List<CreatePurchaseOrderItemRequest> items;
}
