package com.example.SpringEventDriven.service.impl;

import com.example.SpringEventDriven.dto.response.ApprovalHistoryResponse;
import com.example.SpringEventDriven.entity.ApprovalHistory;
import com.example.SpringEventDriven.entity.PurchaseOrder;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.entity.Role;
import com.example.SpringEventDriven.entity.User;
import com.example.SpringEventDriven.event.PurchaseOrderEvent;
import com.example.SpringEventDriven.repository.ApprovalHistoryRepository;
import com.example.SpringEventDriven.repository.PurchaseOrderRepository;
import com.example.SpringEventDriven.service.ApprovalHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApprovalHistoryServiceImpl implements ApprovalHistoryService {

    private final ApprovalHistoryRepository approvalHistoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Override
    @Transactional
    public void recordHistory(PurchaseOrderEvent event) {
        // PO mungkin belum commit ke DB saat event diterima (race condition).
        // Kalau tidak ketemu, kita skip — lebih baik kehilangan 1 history entry
        // daripada terus retry dan bikin message masuk dead-letter queue.
        PurchaseOrder po = purchaseOrderRepository.findById(event.getPoId()).orElse(null);
        if (po == null) {
            log.error("ApprovalHistoryListener: PO #{} not found, skipping history record", event.getPoId());
            return;
        }

        ApprovalHistory history = ApprovalHistory.builder()
                .purchaseOrder(po)
                .actorUsername(event.getActorUsername())
                .fromStatus(event.getFromStatus())
                .toStatus(event.getNewStatus())
                .createdAt(event.getTimestamp()) // pakai timestamp dari event, bukan waktu consumer terima
                .notes(generateNotes(event.getFromStatus(), event.getNewStatus()))
                .build();

        approvalHistoryRepository.save(history);
        log.info("Recorded history for PO #{}: {} -> {}", event.getPoId(), event.getFromStatus(), event.getNewStatus());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApprovalHistoryResponse> getHistoryByPoId(Long poId, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase Order not found"));

        // REQUESTER hanya bisa lihat history PO miliknya sendiri
        if (currentUser.getRole() == Role.REQUESTER
                && !po.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return approvalHistoryRepository
                .findByPurchaseOrder_IdOrderByCreatedAtAsc(poId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApprovalHistoryResponse> getRecentActivity(User currentUser) {
        List<ApprovalHistory> histories;

        if (currentUser.getRole() == Role.REQUESTER) {
            // REQUESTER hanya lihat aktivitas di PO miliknya sendiri
            histories = approvalHistoryRepository
                    .findTop10ByPurchaseOrder_CreatedBy_IdOrderByCreatedAtDesc(currentUser.getId());
        } else {
            // MANAGER dan FINANCE lihat semua aktivitas
            histories = approvalHistoryRepository.findTop10ByOrderByCreatedAtDesc();
        }

        return histories.stream().map(this::toResponse).toList();
    }

    private ApprovalHistoryResponse toResponse(ApprovalHistory h) {
        return ApprovalHistoryResponse.builder()
                .id(h.getId())
                .poId(h.getPurchaseOrder().getId())
                .poTitle(h.getPurchaseOrder().getTitle())
                .actorUsername(h.getActorUsername())
                .fromStatus(h.getFromStatus())
                .toStatus(h.getToStatus())
                .createdAt(h.getCreatedAt())
                .notes(h.getNotes())
                .build();
    }

    // Generate deskripsi otomatis berdasarkan transisi status
    private String generateNotes(PurchaseOrderStatus fromStatus, PurchaseOrderStatus toStatus) {
        if (fromStatus == null) {
            return "Purchase order submitted for approval";
        }
        return switch (toStatus) {
            case MANAGER_APPROVED -> "Approved by manager";
            case FINANCE_APPROVED -> "Approved by finance";
            case REJECTED -> fromStatus == PurchaseOrderStatus.PENDING
                    ? "Rejected by manager"
                    : "Rejected by finance";
            default -> "Status changed to " + toStatus;
        };
    }
}
