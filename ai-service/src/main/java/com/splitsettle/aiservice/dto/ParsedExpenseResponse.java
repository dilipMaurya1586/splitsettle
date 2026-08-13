package com.splitsettle.aiservice.dto;

import java.math.BigDecimal;
import java.util.List;

public record ParsedExpenseResponse(
        String description,
        BigDecimal amount,
        List<String> participantNames,
        String splitType
) {}
