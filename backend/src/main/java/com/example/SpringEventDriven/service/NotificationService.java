package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.dto.response.NotificationResponse;
import com.example.SpringEventDriven.entity.Notification;
import com.example.SpringEventDriven.entity.PurchaseOrderStatus;
import com.example.SpringEventDriven.event.PurchaseOrderEvent;
import com.example.SpringEventDriven.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public void processEvent(PurchaseOrderEvent event) {
        PurchaseOrderStatus newStatus = event.getNewStatus();

        if (newStatus == PurchaseOrderStatus.PENDING) {
            // Target: MANAGER
            saveNotification(event, "MANAGER", null);
        } else if (newStatus == PurchaseOrderStatus.MANAGER_APPROVED) {
            // Target: FINANCE and REQUESTER
            saveNotification(event, "FINANCE", null);
            saveNotification(event, null, event.getRequesterUsername());
        } else if (newStatus == PurchaseOrderStatus.FINANCE_APPROVED || newStatus == PurchaseOrderStatus.REJECTED) {
            // Target: REQUESTER
            saveNotification(event, null, event.getRequesterUsername());
        }
    }

    private void saveNotification(PurchaseOrderEvent event, String role, String username) {
        Notification notification = Notification.builder()
                .poId(event.getPoId())
                .newStatus(event.getNewStatus())
                .actorUsername(event.getActorUsername())
                .requesterUsername(event.getRequesterUsername())
                .timestamp(event.getTimestamp())
                .recipientRole(role)
                .recipientUsername(username)
                .isRead(false)
                .build();
                
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(String role, String username) {
        List<Notification> notifications = notificationRepository.findRelevantNotifications(role, username);
        
        return notifications.stream().map(n -> NotificationResponse.builder()
                .id(n.getId().toString())
                .poId(n.getPoId())
                .newStatus(n.getNewStatus().name())
                .actorUsername(n.getActorUsername())
                .requesterUsername(n.getRequesterUsername())
                .timestamp(n.getTimestamp() != null ? n.getTimestamp().format(formatter) : "")
                .read(n.isRead())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public void markAllAsRead(String role, String username) {
        List<Notification> notifications = notificationRepository.findRelevantNotifications(role, username);
        for (Notification n : notifications) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }
}
