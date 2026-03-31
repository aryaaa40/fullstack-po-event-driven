package com.example.SpringEventDriven.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long poId;
    private Long departmentId;

    @Enumerated(EnumType.STRING)
    private PurchaseOrderStatus newStatus;

    private String actorUsername;
    private String requesterUsername;

    private LocalDateTime timestamp;

    private String recipientRole; // "MANAGER", "FINANCE"
    private String recipientUsername; // Exact username for REQUESTER targets

    @Builder.Default
    private boolean isRead = false;
}
