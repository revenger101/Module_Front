package com.example.tp_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tp_backend.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

	long countByCreatedByAdminId(Long adminId);
}
