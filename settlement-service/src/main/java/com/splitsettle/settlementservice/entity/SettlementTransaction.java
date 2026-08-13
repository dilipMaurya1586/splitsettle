package com.splitsettle.settlementservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "settlement_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettlementTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "from_user_id", nullable = false)
    private Long fromUserId; // person who owes / has to pay

    @Column(name = "to_user_id", nullable = false)
    private Long toUserId; // person who receives

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private Instant createdAt = Instant.now();
    private Instant settledAt;

    public enum Status {
        PENDING, SETTLED
    }
}
