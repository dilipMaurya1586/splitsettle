package com.splitsettle.expenseservice.dto;

import com.splitsettle.expenseservice.entity.Expense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateExpenseRequest(
        @NotNull Long groupId,
        @NotBlank String description,
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
        @NotNull Long paidByUserId,
        @NotNull Expense.SplitType splitType,
        // list of userIds who share this expense. For EQUAL, amounts are auto-calculated.
        // For EXACT, participants must include exact "share" amount per user.
        @NotEmpty List<Long> participantUserIds,
        // only required for EXACT/PERCENTAGE split types: userId -> amount or percentage
        List<SplitShare> shares
) {
    public record SplitShare(@NotNull Long userId, @NotNull BigDecimal value) {}
}
