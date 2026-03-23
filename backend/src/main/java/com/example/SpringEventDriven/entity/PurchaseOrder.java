package com.example.SpringEventDriven.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders", indexes = {
    @Index(name = "idx_po_status", columnList = "status"),
    @Index(name = "idx_po_created_by", columnList = "created_by_id"),
    @Index(name = "idx_po_created_at", columnList = "created_at"),
    @Index(name = "idx_po_priority", columnList = "priority"),
    @Index(name = "idx_po_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseOrderStatus status;

    // --- NEW FIELDS ---

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private POCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private POPriority priority;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(nullable = false)
    private String vendor;

    @Column(name = "required_date")
    private LocalDate requiredDate;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(length = 10)
    private String currency;

    @Column(name = "budget_code")
    private String budgetCode;

    @Column(name = "payment_terms")
    private String paymentTerms;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // --- RELATIONS ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PurchaseOrderItem> items = new ArrayList<>();

    // --- TIMESTAMPS ---

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = PurchaseOrderStatus.PENDING;
        if (this.currency == null) this.currency = "IDR";
        if (this.priority == null) this.priority = POPriority.NORMAL;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
