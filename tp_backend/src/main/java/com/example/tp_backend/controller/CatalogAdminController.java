package com.example.tp_backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.tp_backend.dto.CreateAdminRequest;
import com.example.tp_backend.dto.CreateCategoryRequest;
import com.example.tp_backend.dto.CreateProductRequest;
import com.example.tp_backend.dto.CreateSupplierRequest;
import com.example.tp_backend.dto.UpdateAdminRequest;
import com.example.tp_backend.dto.UpdateCategoryRequest;
import com.example.tp_backend.dto.UpdateProductRequest;
import com.example.tp_backend.dto.UpdateSupplierRequest;
import com.example.tp_backend.model.Admin;
import com.example.tp_backend.model.Category;
import com.example.tp_backend.model.Product;
import com.example.tp_backend.model.Supplier;
import com.example.tp_backend.security.AppUser;
import com.example.tp_backend.service.CatalogAdminService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CatalogAdminController {

    private final CatalogAdminService catalogAdminService;

    public CatalogAdminController(CatalogAdminService catalogAdminService) {
        this.catalogAdminService = catalogAdminService;
    }

    @PostMapping("/admins")
    @ResponseStatus(HttpStatus.CREATED)
    public Admin createAdmin(@RequestBody CreateAdminRequest request) {
        return catalogAdminService.createAdmin(request);
    }

    @GetMapping("/admins")
    public List<Admin> listAdmins() {
        return catalogAdminService.listAdmins();
    }

    @GetMapping("/users")
    public List<AppUser> listUsers() {
        return catalogAdminService.listUsers();
    }

    @GetMapping("/admins/{adminId}")
    public Admin getAdmin(@PathVariable Long adminId) {
        return catalogAdminService.getAdminById(adminId);
    }

    @PutMapping("/admins/{adminId}")
    public Admin updateAdmin(@PathVariable Long adminId, @RequestBody UpdateAdminRequest request) {
        return catalogAdminService.updateAdmin(adminId, request);
    }

    @DeleteMapping("/admins/{adminId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAdmin(@PathVariable Long adminId) {
        catalogAdminService.deleteAdmin(adminId);
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public Category createCategory(@RequestBody CreateCategoryRequest request) {
        return catalogAdminService.createCategory(request);
    }

    @GetMapping("/categories")
    public List<Category> listCategories() {
        return catalogAdminService.listCategories();
    }

    @GetMapping("/categories/{categoryId}")
    public Category getCategory(@PathVariable Long categoryId) {
        return catalogAdminService.getCategoryById(categoryId);
    }

    @PutMapping("/categories/{categoryId}")
    public Category updateCategory(@PathVariable Long categoryId, @RequestBody UpdateCategoryRequest request) {
        return catalogAdminService.updateCategory(categoryId, request);
    }

    @DeleteMapping("/categories/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long categoryId) {
        catalogAdminService.deleteCategory(categoryId);
    }

    @PostMapping("/suppliers")
    @ResponseStatus(HttpStatus.CREATED)
    public Supplier createSupplier(@RequestBody CreateSupplierRequest request) {
        return catalogAdminService.createSupplier(request);
    }

    @GetMapping("/suppliers")
    public List<Supplier> listSuppliers() {
        return catalogAdminService.listSuppliers();
    }

    @GetMapping("/suppliers/{supplierId}")
    public Supplier getSupplier(@PathVariable Long supplierId) {
        return catalogAdminService.getSupplierById(supplierId);
    }

    @PutMapping("/suppliers/{supplierId}")
    public Supplier updateSupplier(@PathVariable Long supplierId, @RequestBody UpdateSupplierRequest request) {
        return catalogAdminService.updateSupplier(supplierId, request);
    }

    @DeleteMapping("/suppliers/{supplierId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSupplier(@PathVariable Long supplierId) {
        catalogAdminService.deleteSupplier(supplierId);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody CreateProductRequest request) {
        return catalogAdminService.createProduct(request);
    }

    @GetMapping("/products")
    public Page<Product> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
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

    @PutMapping("/products/{productId}")
    public Product updateProduct(@PathVariable Long productId, @RequestBody UpdateProductRequest request) {
        return catalogAdminService.updateProduct(productId, request);
    }

    @DeleteMapping("/products/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long productId) {
        catalogAdminService.deleteProduct(productId);
    }
}
