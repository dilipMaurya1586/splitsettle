package com.splitsettle.groupservice.security;

public record AuthenticatedUser(Long userId, String email) {
}
