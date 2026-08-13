package com.splitsettle.settlementservice.kafka;
import com.splitsettle.settlementservice.service.BalanceService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class ExpenseEventListener {

    private final BalanceService balanceService;

    public ExpenseEventListener(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @SuppressWarnings("unchecked")
    @KafkaListener(topics = "expense-created", groupId = "settlement-service-group")
    public void onExpenseCreated(Map<String, Object> event) {
        Long groupId = toLong(event.get("groupId"));
        Long paidByUserId = toLong(event.get("paidByUserId"));
        BigDecimal amount = new BigDecimal(event.get("amount").toString());
        Map<String, Object> splits = (Map<String, Object>) event.get("splits");

        // the payer is credited the full amount (they are owed this much back)
        balanceService.adjustBalance(groupId, paidByUserId, amount);

        // each participant (including payer, if they owe their own share) is debited their split
        splits.forEach((userIdStr, owedAmountObj) -> {
            Long userId = Long.parseLong(userIdStr);
            BigDecimal owedAmount = new BigDecimal(owedAmountObj.toString());
            balanceService.adjustBalance(groupId, userId, owedAmount.negate());
        });
    }

    private Long toLong(Object obj) {
        if (obj instanceof Integer i) return i.longValue();
        if (obj instanceof Long l) return l;
        return Long.parseLong(obj.toString());
    }
}
