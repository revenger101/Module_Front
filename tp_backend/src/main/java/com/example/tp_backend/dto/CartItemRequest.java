package com.example.tp_backend.dto;

public record CartItemRequest(
    Long productId,
    int quantity
) {}
