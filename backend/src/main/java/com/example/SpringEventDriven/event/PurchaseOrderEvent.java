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
    private PurchaseOrderStatus newStatus;
    private String actorUsername;
    private LocalDateTime timestamp;
}
