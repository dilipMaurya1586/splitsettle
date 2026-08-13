package com.splitsettle.settlementservice.dto;

import java.math.BigDecimal;

public record BalanceResponse(Long userId, BigDecimal netBalance) {}
