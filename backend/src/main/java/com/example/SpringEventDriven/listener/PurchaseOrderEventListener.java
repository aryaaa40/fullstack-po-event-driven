package com.example.SpringEventDriven.listener;

import com.example.SpringEventDriven.event.PurchaseOrderEvent;

import com.example.SpringEventDriven.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PurchaseOrderEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @RabbitListener(queues = "po-events-queue")
    public void handleStatusChanged(PurchaseOrderEvent event) {
        log.info("Event received: PO={}, newStatus={}, actor={}, timestamp={}",
                event.getPoId(),
                event.getNewStatus(),
                event.getActorUsername(),
                event.getTimestamp()
        );

        // 1. Save strictly to Postgres DB so it's durable!
        notificationService.processEvent(event);

        // 2. Broadcast via WebSockets for real-time live updates
        messagingTemplate.convertAndSend("/topic/po-events", event);
        log.info("Broadcasted to WebSocket /topic/po-events");
    }
}

