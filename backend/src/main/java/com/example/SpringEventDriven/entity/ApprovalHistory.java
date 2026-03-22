package com.example.SpringEventDriven.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "approval_history", indexes = {
        @Index(name = "idx_ah_po_id", columnList = "po_id"),
        @Index(name = "idx_ah_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(name = "actor_username", nullable = false)
    private String actorUsername;

    // Status sebelum perubahan. Null berarti PO baru dibuat (tidak ada status sebelumnya).
    @Enumerated(EnumType.STRING)
    @Column(name = "from_status")
    private PurchaseOrderStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false)
    private PurchaseOrderStatus toStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Deskripsi otomatis yang di-generate oleh ApprovalHistoryListener
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
