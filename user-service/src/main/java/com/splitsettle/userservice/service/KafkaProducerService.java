package com.splitsettle.userservice.service;

import com.splitsettle.userservice.event.UserRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "user-registered-events";

    public void sendUserRegisteredEvent(UserRegisteredEvent event) {
        try {
            kafkaTemplate.send(TOPIC, event);
            log.info("Sent event to Kafka: {}", event.getEmail());
        } catch (Exception e) {
            // Kafka failure should never block user registration.
            log.warn("Could not publish UserRegisteredEvent for {} — continuing without it. Reason: {}",
                    event.getEmail(), e.getMessage());
        }
    }
}