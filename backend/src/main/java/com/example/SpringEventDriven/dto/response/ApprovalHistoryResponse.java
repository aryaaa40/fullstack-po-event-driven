package com.example.SpringEventDriven.dto.response;

import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalHistoryResponse {

    private Long id;
    private Long poId;
    private String poTitle;       // Untuk context di recent activity widget
    private String actorUsername;
    private PurchaseOrderStatus fromStatus;
    private PurchaseOrderStatus toStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime createdAt;

    private String notes;         // Deskripsi otomatis, e.g. "Approved by manager"
}
