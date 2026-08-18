package com.splitsettle.expenseservice.service;
import com.splitsettle.expenseservice.dto.CreateExpenseRequest;
import com.splitsettle.expenseservice.dto.ExpenseResponse;
import com.splitsettle.expenseservice.entity.Expense;
import com.splitsettle.expenseservice.entity.ExpenseSplit;
import com.splitsettle.expenseservice.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseEventPublisher eventPublisher;

    public ExpenseService(ExpenseRepository expenseRepository, ExpenseEventPublisher eventPublisher) {
        this.expenseRepository = expenseRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        Expense expense = new Expense();
        expense.setGroupId(request.groupId());
        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setPaidByUserId(request.paidByUserId());
        expense.setSplitType(request.splitType());

        List<ExpenseSplit> splits = switch (request.splitType()) {
            case EQUAL -> calculateEqualSplit(request, expense);
            case EXACT -> calculateExactSplit(request, expense);
            case PERCENTAGE -> calculatePercentageSplit(request, expense);
        };

        expense.getSplits().addAll(splits);
        Expense saved = expenseRepository.save(expense);

        eventPublisher.publishExpenseCreated(saved);
        return ExpenseResponse.from(saved);
    }

    private List<ExpenseSplit> calculateEqualSplit(CreateExpenseRequest request, Expense expense) {
        int n = request.participantUserIds().size();
        BigDecimal share = request.amount().divide(BigDecimal.valueOf(n), 2, RoundingMode.HALF_UP);

        // handle rounding remainder — give leftover paise to the first participant
        BigDecimal totalAssigned = share.multiply(BigDecimal.valueOf(n));
        BigDecimal remainder = request.amount().subtract(totalAssigned);

        return request.participantUserIds().stream()
                .map(userId -> {
                    ExpenseSplit split = new ExpenseSplit();
                    split.setExpense(expense);
                    split.setUserId(userId);
                    split.setOwedAmount(share);
                    return split;
                })
                .peek(s -> {
                    if (remainder.compareTo(BigDecimal.ZERO) != 0 && s.getUserId().equals(request.participantUserIds().get(0))) {
                        s.setOwedAmount(s.getOwedAmount().add(remainder));
                    }
                })
                .toList();
    }

    private List<ExpenseSplit> calculateExactSplit(CreateExpenseRequest request, Expense expense) {
        if (request.shares() == null || request.shares().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shares required for EXACT split");
        }
        BigDecimal total = request.shares().stream().map(CreateExpenseRequest.SplitShare::value)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(request.amount()) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Sum of exact shares (" + total + ") must equal total amount (" + request.amount() + ")");
        }

        return request.shares().stream().map(s -> {
            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUserId(s.userId());
            split.setOwedAmount(s.value());
            return split;
        }).toList();
    }

    private List<ExpenseSplit> calculatePercentageSplit(CreateExpenseRequest request, Expense expense) {
        if (request.shares() == null || request.shares().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shares required for PERCENTAGE split");
        }
        BigDecimal totalPercent = request.shares().stream().map(CreateExpenseRequest.SplitShare::value)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalPercent.compareTo(BigDecimal.valueOf(100)) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Percentages must sum to 100, got " + totalPercent);
        }

        return request.shares().stream().map(s -> {
            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUserId(s.userId());
            BigDecimal owed = request.amount().multiply(s.value())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            split.setOwedAmount(owed);
            return split;
        }).toList();
    }

    public List<ExpenseResponse> getExpensesForGroup(Long groupId) {
        return expenseRepository.findByGroupId(groupId).stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    public ExpenseResponse getExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
        return ExpenseResponse.from(expense);
    }

    @Transactional
    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
        expenseRepository.delete(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long expenseId, CreateExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));

        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setPaidByUserId(request.paidByUserId());
        expense.setSplitType(request.splitType());
        expense.getSplits().clear();

        List<ExpenseSplit> splits = switch (request.splitType()) {
            case EQUAL -> calculateEqualSplit(request, expense);
            case EXACT -> calculateExactSplit(request, expense);
            case PERCENTAGE -> calculatePercentageSplit(request, expense);
        };
        expense.getSplits().addAll(splits);

        Expense saved = expenseRepository.save(expense);
        eventPublisher.publishExpenseCreated(saved);
        return ExpenseResponse.from(saved);
    }
}
