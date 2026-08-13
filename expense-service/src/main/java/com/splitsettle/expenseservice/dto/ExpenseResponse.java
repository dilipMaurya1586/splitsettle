package com.splitsettle.expenseservice.dto;

import com.splitsettle.expenseservice.entity.Expense;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ExpenseResponse(
        Long id,
        Long groupId,
        String description,
        BigDecimal amount,
        Long paidByUserId,
        Expense.SplitType splitType,
        List<SplitInfo> splits,
        Instant createdAt
) {
    public record SplitInfo(Long userId, BigDecimal owedAmount) {}

    public static ExpenseResponse from(Expense expense) {
        List<SplitInfo> splits = expense.getSplits().stream()
                .map(s -> new SplitInfo(s.getUserId(), s.getOwedAmount()))
                .toList();
        return new ExpenseResponse(expense.getId(), expense.getGroupId(), expense.getDescription(),
                expense.getAmount(), expense.getPaidByUserId(), expense.getSplitType(), splits, expense.getCreatedAt());
    }
}
