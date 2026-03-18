package com.example.SpringEventDriven.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "po.exchange";
    public static final String QUEUE_NAME = "po-events-queue";
    public static final String ROUTING_KEY = "po.status.#";

    @Bean
    public TopicExchange poExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue poEventsQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public Binding poBinding(Queue poEventsQueue, TopicExchange poExchange) {
        return BindingBuilder
                .bind(poEventsQueue)
                .to(poExchange)
                .with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
