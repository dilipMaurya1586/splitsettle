package com.splitsettle.settlementservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "balances", uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Balance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // positive => this user is owed money (net creditor)
    // negative => this user owes money (net debtor)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal netBalance = BigDecimal.ZERO;

    private Instant updatedAt = Instant.now();
}
