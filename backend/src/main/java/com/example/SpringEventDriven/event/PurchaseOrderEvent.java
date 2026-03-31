package com.example.SpringEventDriven.event;

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
public class PurchaseOrderEvent {

    private Long poId;
    private Long departmentId; // department ID dari PO terkait (untuk filtering FE)
    private PurchaseOrderStatus fromStatus; // status sebelum perubahan (null jika baru dibuat)
    private PurchaseOrderStatus newStatus;
    private String actorUsername;
    private String requesterUsername; // username pemilik PO (createdBy)
    private LocalDateTime timestamp;
}
