package com.splitsettle.settlementservice.dto;

import java.math.BigDecimal;

public record SettlementResponse(Long fromUserId, Long toUserId, BigDecimal amount) {}
