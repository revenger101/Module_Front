package com.example.tp_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.tp_backend.model.Panier;
import com.example.tp_backend.security.AppUser;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Long> {
    Optional<Panier> findByUser(AppUser user);
}
