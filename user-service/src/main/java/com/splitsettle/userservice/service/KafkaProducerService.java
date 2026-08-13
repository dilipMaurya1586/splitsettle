package com.splitsettle.userservice.service;

import com.splitsettle.userservice.event.UserRegisteredEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "user-registered-events";

    public void sendUserRegisteredEvent(UserRegisteredEvent event) {
        kafkaTemplate.send(TOPIC, event);
        System.out.println("📤 Sent event to Kafka: " + event.getEmail());
    }
}