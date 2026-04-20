package com.example.tp_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.tp_backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

	long countByCategoryId(Long categoryId);

	long countBySupplierId(Long supplierId);

	long countByCreatedByAdminId(Long adminId);
}
