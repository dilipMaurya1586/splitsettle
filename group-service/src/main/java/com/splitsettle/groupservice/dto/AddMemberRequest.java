package com.splitsettle.groupservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddMemberRequest(
        @NotNull Long userId,
        @NotBlank @Email String userEmail,
        @NotBlank String userFullName
) {}
