package com.example.tp_backend.dto;

public record AuthTokenResponse(String tokenType, String accessToken, long expiresInMs, AuthUserResponse user) {
}
