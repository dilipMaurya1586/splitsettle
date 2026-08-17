package com.splitsettle.expenseservice.service;

import com.splitsettle.expenseservice.entity.Expense;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(ExpenseEventPublisher.class);
    private static final String TOPIC = "expense-created";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public ExpenseEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    // Settlement Service listens to this topic and recalculates balances for the group
    public void publishExpenseCreated(Expense expense) {
        try {
            Map<String, Object> event = Map.of(
                    "expenseId", expense.getId(),
                    "groupId", expense.getGroupId(),
                    "amount", expense.getAmount(),
                    "paidByUserId", expense.getPaidByUserId(),
                    "splits", expense.getSplits().stream()
                            .collect(Collectors.toMap(s -> s.getUserId().toString(), s -> s.getOwedAmount())),
                    "eventType", "EXPENSE_CREATED"
            );
            kafkaTemplate.send(TOPIC, String.valueOf(expense.getGroupId()), event);
        } catch (Exception e) {
            log.warn("Could not publish EXPENSE_CREATED event for group {} — continuing anyway. Reason: {}",
                    expense.getGroupId(), e.getMessage());
        }
    }
}


//package com.splitsettle.expenseservice.service;
//
//import com.splitsettle.expenseservice.entity.Expense;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Service
//public class ExpenseEventPublisher {
//
//    private static final String TOPIC = "expense-created";
//
//    private final KafkaTemplate<String, Object> kafkaTemplate;
//
//    public ExpenseEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
//        this.kafkaTemplate = kafkaTemplate;
//    }
//
//    // Settlement Service listens to this topic and recalculates balances for the group
//    public void publishExpenseCreated(Expense expense) {
//
//        // 🔥 YEH LINE ADD KARO (Taaki console mein dikhe):
//        System.out.println("📤 Sent expense event to Kafka: Group ID: " + expense.getGroupId() + ", Amount: " + expense.getAmount());
//
//        Map<String, Object> event = Map.of(
//                "expenseId", expense.getId(),
//                "groupId", expense.getGroupId(),
//                "amount", expense.getAmount(),
//                "paidByUserId", expense.getPaidByUserId(),
//                "splits", expense.getSplits().stream()
//                        .collect(Collectors.toMap(s -> s.getUserId().toString(), s -> s.getOwedAmount())),
//                "eventType", "EXPENSE_CREATED"
//        );
//        kafkaTemplate.send(TOPIC, String.valueOf(expense.getGroupId()), event);
//    }
//}
