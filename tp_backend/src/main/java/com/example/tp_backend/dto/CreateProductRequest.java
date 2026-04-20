package com.example.tp_backend.dto;

import java.math.BigDecimal;

public record CreateProductRequest(
        String name,
        String description,
        String imageUrl,
        BigDecimal price,
        Integer quantityInStock,
        Long categoryId,
        Long supplierId
) {
}
