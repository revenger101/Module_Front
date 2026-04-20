package com.example.tp_backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.tp_backend.model.LigneCommande;
import com.example.tp_backend.model.Panier;
import com.example.tp_backend.model.Product;
import com.example.tp_backend.repository.PanierRepository;
import com.example.tp_backend.repository.ProductRepository;
import com.example.tp_backend.security.AppUser;
import com.example.tp_backend.security.AppUserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class CartService {

    private final PanierRepository panierRepository;
    private final ProductRepository productRepository;
    private final AppUserRepository appUserRepository;

    public CartService(PanierRepository panierRepository, ProductRepository productRepository, AppUserRepository appUserRepository) {
        this.panierRepository = panierRepository;
        this.productRepository = productRepository;
        this.appUserRepository = appUserRepository;
    }

    public Panier getPanierForUser(String username) {
        AppUser user = appUserRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        return panierRepository.findByUser(user)
                .orElseGet(() -> {
                    Panier newPanier = new Panier();
                    newPanier.setUser(user);
                    return panierRepository.save(newPanier);
                });
    }

    public Panier addItemToCart(String username, Long productId, int quantity) {
        Panier panier = getPanierForUser(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        Optional<LigneCommande> existingItem = panier.getLignes().stream()
                .filter(ligne -> ligne.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            LigneCommande ligne = existingItem.get();
            ligne.setQuantity(ligne.getQuantity() + quantity);
        } else {
            LigneCommande newItem = new LigneCommande(panier, product, quantity);
            panier.addLigne(newItem);
        }

        return panierRepository.save(panier);
    }

    public Panier updateItemQuantity(String username, Long productId, int quantity) {
        Panier panier = getPanierForUser(username);

        Optional<LigneCommande> existingItem = panier.getLignes().stream()
                .filter(ligne -> ligne.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            if (quantity <= 0) {
                panier.removeLigne(existingItem.get());
            } else {
                existingItem.get().setQuantity(quantity);
            }
        }
        
        return panierRepository.save(panier);
    }

    public Panier removeItemFromCart(String username, Long productId) {
        Panier panier = getPanierForUser(username);

        panier.getLignes().removeIf(ligne -> ligne.getProduct().getId().equals(productId));
        
        return panierRepository.save(panier);
    }
    
    public void clearCart(String username) {
        Panier panier = getPanierForUser(username);
        panier.getLignes().clear();
        panierRepository.save(panier);
    }
}
