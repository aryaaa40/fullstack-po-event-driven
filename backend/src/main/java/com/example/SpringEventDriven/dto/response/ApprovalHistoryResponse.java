package com.example.SpringEventDriven.dto.response;

import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
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
    private LocalDateTime createdAt;
    private String notes;         // Deskripsi otomatis, e.g. "Approved by manager"
}
