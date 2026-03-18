package com.example.SpringEventDriven.listener;

import com.example.SpringEventDriven.event.PurchaseOrderEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PurchaseOrderEventListener {

    @RabbitListener(queues = "po-events-queue")
    public void handleStatusChanged(PurchaseOrderEvent event) {
        log.info("Event received: PO={}, newStatus={}, actor={}, timestamp={}",
                event.getPoId(),
                event.getNewStatus(),
                event.getActorUsername(),
                event.getTimestamp()
        );

        // TODO: Membuat trigger WebSocket notification ke frontend.
    }
}
