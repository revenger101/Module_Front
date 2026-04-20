package com.example.tp_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.tp_backend.model.Product;
import com.example.tp_backend.service.CatalogAdminService;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicCatalogController {

    private final CatalogAdminService catalogAdminService;

    public PublicCatalogController(CatalogAdminService catalogAdminService) {
        this.catalogAdminService = catalogAdminService;
    }

    @GetMapping("/products")
    public Page<Product> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId
    ) {
        return catalogAdminService.listProductsPaged(page, size, q, categoryId, supplierId);
    }

    @GetMapping("/products/{productId}")
    public Product getProduct(@PathVariable Long productId) {
        return catalogAdminService.getProductById(productId);
    }
}
