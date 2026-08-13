//package com.splitsettle.userservice.service;
//
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.Map;
//
//@Service
//public class UserEventPublisher {
//
//    private static final String TOPIC = "user-registered";
//
//    private final KafkaTemplate<String, Object> kafkaTemplate;
//
//    public UserEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
//        this.kafkaTemplate = kafkaTemplate;
//    }
//
//    public void publishUserRegistered(Long userId, String email, String fullName) {
//        Map<String, Object> event = Map.of(
//                "userId", userId,
//                "email", email,
//                "fullName", fullName,
//                "eventType", "USER_REGISTERED"
//        );
//        kafkaTemplate.send(TOPIC, String.valueOf(userId), event);
//    }
//}
