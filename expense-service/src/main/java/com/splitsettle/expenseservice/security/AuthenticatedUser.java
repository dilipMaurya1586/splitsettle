package com.splitsettle.expenseservice.security;

public record AuthenticatedUser(Long userId, String email) {
}
