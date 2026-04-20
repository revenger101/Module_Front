package com.example.tp_backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.tp_backend.dto.CreateAdminRequest;
import com.example.tp_backend.dto.CreateCategoryRequest;
import com.example.tp_backend.dto.CreateProductRequest;
import com.example.tp_backend.dto.CreateSupplierRequest;
import com.example.tp_backend.dto.UpdateAdminRequest;
import com.example.tp_backend.dto.UpdateCategoryRequest;
import com.example.tp_backend.dto.UpdateProductRequest;
import com.example.tp_backend.dto.UpdateSupplierRequest;
import com.example.tp_backend.exception.NotFoundException;
import com.example.tp_backend.model.Admin;
import com.example.tp_backend.model.Category;
import com.example.tp_backend.model.Product;
import com.example.tp_backend.model.Supplier;
import com.example.tp_backend.security.AppUser;
import com.example.tp_backend.security.AppUserRepository;
import com.example.tp_backend.security.Role;
import jakarta.persistence.criteria.Predicate;
import com.example.tp_backend.repository.AdminRepository;
import com.example.tp_backend.repository.CategoryRepository;
import com.example.tp_backend.repository.ProductRepository;
import com.example.tp_backend.repository.SupplierRepository;

@Service
public class CatalogAdminService {

    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public CatalogAdminService(
            AdminRepository adminRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            ProductRepository productRepository,
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.adminRepository = adminRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Admin createAdmin(CreateAdminRequest request) {
        String username = requireText(request.username(), "username");
        String email = requireText(request.email(), "email");
        String password = requireText(request.password(), "password");

        if (adminRepository.existsByUsernameIgnoreCase(username)
                || appUserRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        if (adminRepository.existsByEmailIgnoreCase(email)
                || appUserRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.ROLE_ADMIN);
        user.setEnabled(true);
        user = appUserRepository.save(user);

        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setUserAccount(user);

        return adminRepository.save(admin);
    }

    @Transactional(readOnly = true)
    public List<Admin> listAdmins() {
        return adminRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<AppUser> listUsers() {
        return appUserRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Admin getAdminById(Long adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new NotFoundException("Admin not found with id=" + adminId));
    }

    @Transactional
    public Admin updateAdmin(Long adminId, UpdateAdminRequest request) {
        Admin admin = getAdminById(adminId);
        String username = requireText(request.username(), "username");
        String email = requireText(request.email(), "email");

        if (!admin.getUsername().equalsIgnoreCase(username)
                && (adminRepository.existsByUsernameIgnoreCase(username)
                || appUserRepository.existsByUsernameIgnoreCase(username))) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        if (!admin.getEmail().equalsIgnoreCase(email)
                && (adminRepository.existsByEmailIgnoreCase(email)
                || appUserRepository.existsByEmailIgnoreCase(email))) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        admin.setUsername(username);
        admin.setEmail(email);

        AppUser appUser = admin.getUserAccount();
        appUser.setUsername(username);
        appUser.setEmail(email);
        appUserRepository.save(appUser);

        return adminRepository.save(admin);
    }

    @Transactional
    public void deleteAdmin(Long adminId) {
        Admin admin = getAdminById(adminId);
        Admin currentAdmin = getCurrentAdmin();
        if (currentAdmin.getId().equals(adminId)) {
            throw new IllegalArgumentException("Current admin account cannot be deleted");
        }

        long categories = categoryRepository.countByCreatedByAdminId(adminId);
        long suppliers = supplierRepository.countByCreatedByAdminId(adminId);
        long products = productRepository.countByCreatedByAdminId(adminId);

        if (categories > 0 || suppliers > 0 || products > 0) {
            throw new IllegalArgumentException("Cannot delete admin with existing categories, suppliers, or products");
        }

        AppUser appUser = admin.getUserAccount();
        adminRepository.delete(admin);
        appUserRepository.delete(appUser);
    }

    @Transactional
    public Category createCategory(CreateCategoryRequest request) {
        Admin admin = getCurrentAdmin();
        String name = requireText(request.name(), "name");
        String description = normalizeOptionalText(request.description());

        categoryRepository.findByNameIgnoreCase(name).ifPresent(existing -> {
            throw new IllegalArgumentException("Category name already exists: " + name);
        });

        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setCreatedByAdmin(admin);

        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public List<Category> listCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found with id=" + categoryId));
    }

    @Transactional
    public Category updateCategory(Long categoryId, UpdateCategoryRequest request) {
        Category category = getCategoryById(categoryId);

        String name = requireText(request.name(), "name");
        categoryRepository.findByNameIgnoreCase(name).ifPresent(existing -> {
            if (!existing.getId().equals(categoryId)) {
                throw new IllegalArgumentException("Category name already exists: " + name);
            }
        });

        category.setName(name);
        category.setDescription(normalizeOptionalText(request.description()));
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = getCategoryById(categoryId);
        if (productRepository.countByCategoryId(categoryId) > 0) {
            throw new IllegalArgumentException("Cannot delete category linked to existing products");
        }
        categoryRepository.delete(category);
    }

    @Transactional
    public Supplier createSupplier(CreateSupplierRequest request) {
        Admin admin = getCurrentAdmin();
        String name = requireText(request.name(), "name");
        String contactEmail = requireText(request.contactEmail(), "contactEmail");
        String phone = normalizeOptionalText(request.phone());

        Supplier supplier = new Supplier();
        supplier.setName(name);
        supplier.setContactEmail(contactEmail);
        supplier.setPhone(phone);
        supplier.setImageUrl(normalizeOptionalText(request.imageUrl()));
        supplier.setCreatedByAdmin(admin);

        return supplierRepository.save(supplier);
    }

    @Transactional(readOnly = true)
    public List<Supplier> listSuppliers() {
        return supplierRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Supplier getSupplierById(Long supplierId) {
        return supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found with id=" + supplierId));
    }

    @Transactional
    public Supplier updateSupplier(Long supplierId, UpdateSupplierRequest request) {
        Supplier supplier = getSupplierById(supplierId);
        supplier.setName(requireText(request.name(), "name"));
        supplier.setContactEmail(requireText(request.contactEmail(), "contactEmail"));
        supplier.setPhone(normalizeOptionalText(request.phone()));
        supplier.setImageUrl(normalizeOptionalText(request.imageUrl()));
        return supplierRepository.save(supplier);
    }

    @Transactional
    public void deleteSupplier(Long supplierId) {
        Supplier supplier = getSupplierById(supplierId);
        if (productRepository.countBySupplierId(supplierId) > 0) {
            throw new IllegalArgumentException("Cannot delete supplier linked to existing products");
        }
        supplierRepository.delete(supplier);
    }

    @Transactional
    public Product createProduct(CreateProductRequest request) {
        Admin admin = getCurrentAdmin();
        Category category = getCategoryById(request.categoryId());
        Supplier supplier = getSupplierById(request.supplierId());

        String name = requireText(request.name(), "name");
        String description = normalizeOptionalText(request.description());

        if (request.price() == null || request.price().signum() < 0) {
            throw new IllegalArgumentException("price must be a positive number or zero");
        }
        if (request.quantityInStock() == null || request.quantityInStock() < 0) {
            throw new IllegalArgumentException("quantityInStock must be a positive integer or zero");
        }

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setImageUrl(normalizeOptionalText(request.imageUrl()));
        product.setPrice(request.price());
        product.setQuantityInStock(request.quantityInStock());
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setCreatedByAdmin(admin);

        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Product> listProductsPaged(
            int page,
            int size,
            String q,
            Long categoryId,
            Long supplierId
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(safePage, safeSize);
        String textFilter = normalizeOptionalText(q);

        return productRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new java.util.ArrayList<>();

            if (textFilter != null) {
                String like = "%" + textFilter.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), like);
                Predicate descMatch = cb.like(cb.lower(cb.coalesce(root.get("description"), "")), like);
                predicates.add(cb.or(nameMatch, descMatch));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (supplierId != null) {
                predicates.add(cb.equal(root.get("supplier").get("id"), supplierId));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        }, pageable);
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id=" + productId));
    }

    @Transactional
    public Product updateProduct(Long productId, UpdateProductRequest request) {
        Product product = getProductById(productId);

        Category category = getCategoryById(request.categoryId());
        Supplier supplier = getSupplierById(request.supplierId());

        String name = requireText(request.name(), "name");
        String description = normalizeOptionalText(request.description());

        if (request.price() == null || request.price().signum() < 0) {
            throw new IllegalArgumentException("price must be a positive number or zero");
        }
        if (request.quantityInStock() == null || request.quantityInStock() < 0) {
            throw new IllegalArgumentException("quantityInStock must be a positive integer or zero");
        }

        product.setName(name);
        product.setDescription(description);
        product.setImageUrl(normalizeOptionalText(request.imageUrl()));
        product.setPrice(request.price());
        product.setQuantityInStock(request.quantityInStock());
        product.setCategory(category);
        product.setSupplier(supplier);

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = getProductById(productId);
        productRepository.delete(product);
    }

    private String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
        return value.trim();
    }

    private Admin getCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new NotFoundException("No authenticated admin found");
        }

        String username = authentication.getName();
        return adminRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new NotFoundException("Admin profile not found for username=" + username));
    }

    private String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
