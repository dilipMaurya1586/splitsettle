package com.splitsettle.aiservice.dto;

import jakarta.validation.constraints.NotBlank;

public record ParseExpenseRequest(
        @NotBlank String naturalLanguageInput
) {}
