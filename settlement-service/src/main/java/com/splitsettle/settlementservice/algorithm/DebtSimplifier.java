package com.splitsettle.settlementservice.algorithm;

import com.splitsettle.settlementservice.entity.Balance;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * DebtSimplifier reduces the number of transactions needed to settle all balances
 * within a group to the minimum possible.
 *
 * Approach: Greedy algorithm using two priority queues (max-heaps) —
 * one for creditors (people owed money) and one for debtors (people who owe money).
 * At each step, match the biggest creditor with the biggest debtor, settle the
 * smaller of the two amounts, and repeat until all balances are zero.
 *
 * This guarantees at most (N - 1) transactions for N participants with non-zero
 * balances, compared to a naive pairwise settlement which could require O(N^2).
 *
 * Time Complexity: O(N log N) — N inserts/removals from heaps of size N.
 * Space Complexity: O(N)
 */
@Component
public class DebtSimplifier {

    private static final BigDecimal THRESHOLD = new BigDecimal("0.01");

    public record SimplifiedTransaction(Long fromUserId, Long toUserId, BigDecimal amount) {}

    public List<SimplifiedTransaction> simplify(List<Balance> balances) {
        // max-heap for creditors (positive balance, owed money) — highest amount first
        PriorityQueue<Balance> creditors = new PriorityQueue<>(
                (a, b) -> b.getNetBalance().compareTo(a.getNetBalance()));
        // max-heap for debtors (negative balance, owes money) — most negative first (largest debt)
        PriorityQueue<Balance> debtors = new PriorityQueue<>(
                (a, b) -> a.getNetBalance().compareTo(b.getNetBalance()));

        for (Balance b : balances) {
            if (b.getNetBalance().compareTo(THRESHOLD) > 0) {
                creditors.add(b);
            } else if (b.getNetBalance().compareTo(THRESHOLD.negate()) < 0) {
                debtors.add(b);
            }
            // balances within +/- 0.01 are considered already settled, ignored
        }

        List<SimplifiedTransaction> transactions = new ArrayList<>();

        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            Balance topCreditor = creditors.poll();
            Balance topDebtor = debtors.poll();

            BigDecimal owed = topCreditor.getNetBalance();
            BigDecimal debt = topDebtor.getNetBalance().abs();

            BigDecimal settledAmount = owed.min(debt).setScale(2, RoundingMode.HALF_UP);

            transactions.add(new SimplifiedTransaction(
                    topDebtor.getUserId(), topCreditor.getUserId(), settledAmount));

            BigDecimal remainingCredit = owed.subtract(settledAmount);
            BigDecimal remainingDebt = debt.subtract(settledAmount);

            // whichever side still has a non-zero balance goes back into its heap
            if (remainingCredit.compareTo(THRESHOLD) > 0) {
                topCreditor.setNetBalance(remainingCredit);
                creditors.add(topCreditor);
            }
            if (remainingDebt.compareTo(THRESHOLD) > 0) {
                topDebtor.setNetBalance(remainingDebt.negate());
                debtors.add(topDebtor);
            }
        }

        return transactions;
    }
}
