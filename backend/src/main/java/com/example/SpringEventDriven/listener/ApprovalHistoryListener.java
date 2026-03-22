package com.example.SpringEventDriven.listener;

import com.example.SpringEventDriven.config.RabbitMQConfig;
import com.example.SpringEventDriven.event.PurchaseOrderEvent;
import com.example.SpringEventDriven.service.ApprovalHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ApprovalHistoryListener {

    private final ApprovalHistoryService approvalHistoryService;

    // Consume dari po-history-queue yang BERBEDA dari po-events-queue (WebSocket listener).
    // Kedua queue sama-sama di-bind ke po.exchange dengan routing key po.status.#,
    // sehingga masing-masing mendapat copy event yang sama secara independen.
    @RabbitListener(queues = RabbitMQConfig.HISTORY_QUEUE_NAME)
    public void handleStatusChanged(PurchaseOrderEvent event) {
        log.info("ApprovalHistoryListener: PO #{} status changed to {}", event.getPoId(), event.getNewStatus());
        approvalHistoryService.recordHistory(event);
    }
}
