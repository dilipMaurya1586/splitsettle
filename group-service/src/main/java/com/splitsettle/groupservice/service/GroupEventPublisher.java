package com.splitsettle.groupservice.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class GroupEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public GroupEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishMemberAdded(Long groupId, Long userId, String email) {
        Map<String, Object> event = Map.of(
                "groupId", groupId,
                "userId", userId,
                "email", email,
                "eventType", "MEMBER_ADDED"
        );
        kafkaTemplate.send("group-member-added", String.valueOf(groupId), event);
    }
}
