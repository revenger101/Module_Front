package com.example.tp_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tp_backend.dto.CartItemRequest;
import com.example.tp_backend.model.Panier;
import com.example.tp_backend.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Panier> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Panier panier = cartService.getPanierForUser(userDetails.getUsername());
        return ResponseEntity.ok(panier);
    }

    @PostMapping("/items")
    public ResponseEntity<Panier> addItemToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CartItemRequest request) {
        Panier panier = cartService.addItemToCart(userDetails.getUsername(), request.productId(), request.quantity());
        return ResponseEntity.ok(panier);
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<Panier> updateItemQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId,
            @RequestBody CartItemRequest request) {
        Panier panier = cartService.updateItemQuantity(userDetails.getUsername(), productId, request.quantity());
        return ResponseEntity.ok(panier);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Panier> removeItemFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        Panier panier = cartService.removeItemFromCart(userDetails.getUsername(), productId);
        return ResponseEntity.ok(panier);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
