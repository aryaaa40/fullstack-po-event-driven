package com.example.SpringEventDriven.dto.response;

import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@JsonPropertyOrder({"id", "title", "description", "amount", "status", "createdByUsername", "createdAt", "updatedAt"})
public class PurchaseOrderResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private PurchaseOrderStatus status;
    private String createdByUsername;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
