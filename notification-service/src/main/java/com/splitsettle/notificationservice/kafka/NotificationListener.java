package com.splitsettle.notificationservice.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);

    private final JavaMailSender mailSender;

    public NotificationListener(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @KafkaListener(topics = "user-registered", groupId = "notification-service-group")
    public void onUserRegistered(Map<String, Object> event) {
        String email = (String) event.get("email");
        String fullName = (String) event.get("fullName");
        log.info("Sending welcome email to {}", email);
        sendEmail(email, "Welcome to SplitSettle!",
                "Hi " + fullName + ",\n\nYour account has been created successfully. Start splitting expenses with friends now!");
    }

    @KafkaListener(topics = "group-member-added", groupId = "notification-service-group")
    public void onMemberAdded(Map<String, Object> event) {
        String email = (String) event.get("email");
        log.info("Notifying {} they were added to a group", email);
        sendEmail(email, "You've been added to a group on SplitSettle",
                "You were added to a new expense-sharing group. Log in to check your balance.");
    }

    @KafkaListener(topics = "expense-created", groupId = "notification-service-group")
    public void onExpenseCreated(Map<String, Object> event) {

        // 🔥 YEH LINE ADD KARO:
        System.out.println("New expense created in group " + event.get("groupId") + ": amount " + event.get("amount"));
        
        // In production, this would look up member emails via user-service.
        // Kept lightweight here — just logs, since email requires member lookup.
        log.info("New expense created in group {}: amount {}", event.get("groupId"), event.get("amount"));
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            // don't let email failure break the event processing pipeline
            log.warn("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
