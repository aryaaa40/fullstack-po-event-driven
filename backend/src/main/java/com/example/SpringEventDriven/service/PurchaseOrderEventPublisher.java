package com.example.SpringEventDriven.service;

import com.example.SpringEventDriven.config.RabbitMQConfig;
import com.example.SpringEventDriven.event.PurchaseOrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseOrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishStatusChanged(PurchaseOrderEvent event) {
        String routingKey = "po.status." + event.getNewStatus().name().toLowerCase();

        log.info("Publishing event: PO={}, status={}, actor={}",
                event.getPoId(), event.getNewStatus(), event.getActorUsername());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                routingKey,
                event
        );
    }
}
