package com.example.tp_backend.security;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.tp_backend.model.Admin;
import com.example.tp_backend.model.Category;
import com.example.tp_backend.model.Product;
import com.example.tp_backend.model.Supplier;
import com.example.tp_backend.repository.AdminRepository;
import com.example.tp_backend.repository.CategoryRepository;
import com.example.tp_backend.repository.ProductRepository;
import com.example.tp_backend.repository.SupplierRepository;

@Component
public class  BootstrapDataInitializer implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.username}")
    private String bootstrapAdminUsername;

    @Value("${app.bootstrap.admin.email}")
    private String bootstrapAdminEmail;

    @Value("${app.bootstrap.admin.password}")
    private String bootstrapAdminPassword;

    @Value("${app.bootstrap.seed-demo-data:true}")
    private boolean seedDemoData;

    public BootstrapDataInitializer(
            AppUserRepository appUserRepository,
            AdminRepository adminRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.adminRepository = adminRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Admin bootstrapAdmin = ensureBootstrapAdmin();

        if (seedDemoData) {
            seedDemoUsers();
            seedTunisianCatalog(bootstrapAdmin);
        }
    }

    private Admin ensureBootstrapAdmin() {
        AppUser adminUser = appUserRepository
                .findByUsernameIgnoreCase(bootstrapAdminUsername.trim())
                .orElseGet(() -> {
                    AppUser user = new AppUser();
                    user.setUsername(bootstrapAdminUsername.trim());
                    user.setEmail(bootstrapAdminEmail.trim());
                    user.setPassword(passwordEncoder.encode(bootstrapAdminPassword));
                    user.setRole(Role.ROLE_ADMIN);
                    user.setEnabled(true);
                    return appUserRepository.save(user);
                });

        return adminRepository
                .findByUsernameIgnoreCase(adminUser.getUsername())
                .orElseGet(() -> {
                    Admin admin = new Admin();
                    admin.setUsername(adminUser.getUsername());
                    admin.setEmail(adminUser.getEmail());
                    admin.setUserAccount(adminUser);
                    return adminRepository.save(admin);
                });
    }

    private void seedDemoUsers() {
        if (!appUserRepository.existsByUsernameIgnoreCase("amira.tn")) {
            AppUser user = new AppUser();
            user.setUsername("amira.tn");
            user.setEmail("amira.benali@example.tn");
            user.setPassword(passwordEncoder.encode("client123"));
            user.setRole(Role.ROLE_USER);
            user.setEnabled(true);
            appUserRepository.save(user);
        }

        if (!appUserRepository.existsByUsernameIgnoreCase("admin.tunis")) {
            AppUser user = new AppUser();
            user.setUsername("admin.tunis");
            user.setEmail("admin.tunis@example.tn");
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setRole(Role.ROLE_ADMIN);
            user.setEnabled(true);
            user = appUserRepository.save(user);

            if (!adminRepository.existsByUsernameIgnoreCase(user.getUsername())) {
                Admin admin = new Admin();
                admin.setUsername(user.getUsername());
                admin.setEmail(user.getEmail());
                admin.setUserAccount(user);
                adminRepository.save(admin);
            }
        }
    }

    private void seedTunisianCatalog(Admin bootstrapAdmin) {
        if (categoryRepository.count() > 0 || supplierRepository.count() > 0 || productRepository.count() > 0) {
            return;
        }

        Category epicerie = createCategory("Epicerie Tunisienne", "Produits quotidiens et traditionnels", bootstrapAdmin);
        Category boissons = createCategory("Boissons", "Jus, sodas et boissons locales", bootstrapAdmin);
        Category soins = createCategory("Soins", "Produits de soin et hygiene", bootstrapAdmin);

        Supplier carthage = createSupplier(
            "Carthage Distribution",
            "contact@carthage-distribution.tn",
            "+216 71 234 567",
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
            bootstrapAdmin
        );
        Supplier medina = createSupplier(
            "Medina Market",
            "achat@medinamarket.tn",
            "+216 70 111 222",
            "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=800&q=80",
            bootstrapAdmin
        );
        Supplier sfax = createSupplier(
            "Sfax Agro",
            "vente@sfaxagro.tn",
            "+216 74 333 444",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
            bootstrapAdmin
        );

        List<Product> products = List.of(
                createProduct(
                    "Harissa Le Phare",
                    "Tube 140g - piment rouge tunisien",
                    "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80",
                    new BigDecimal("2.95"),
                    120,
                    epicerie,
                    carthage,
                    bootstrapAdmin
                ),
                createProduct(
                    "Couscous Fin Warda",
                    "Semoule fine 1kg",
                    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
                    new BigDecimal("3.80"),
                    90,
                    epicerie,
                    medina,
                    bootstrapAdmin
                ),
                createProduct(
                    "Huile d'olive Sfax Premium",
                    "Bouteille 750ml extra vierge",
                    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
                    new BigDecimal("24.90"),
                    45,
                    epicerie,
                    sfax,
                    bootstrapAdmin
                ),
                createProduct(
                    "Boga Cidre",
                    "Canette 24cl",
                    "https://images.unsplash.com/photo-1610873166986-7d8d2f7f4bea?auto=format&fit=crop&w=900&q=80",
                    new BigDecimal("1.45"),
                    200,
                    boissons,
                    carthage,
                    bootstrapAdmin
                ),
                createProduct(
                    "Jus de Grenade Cap Bon",
                    "Bouteille 1L",
                    "https://images.unsplash.com/photo-1600271886742-f049cd5bba3f?auto=format&fit=crop&w=900&q=80",
                    new BigDecimal("4.60"),
                    70,
                    boissons,
                    medina,
                    bootstrapAdmin
                ),
                createProduct(
                    "Savon Jasmin de Nabeul",
                    "Savon artisanal 100g",
                    "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=80",
                    new BigDecimal("5.20"),
                    60,
                    soins,
                    sfax,
                    bootstrapAdmin
                )
        );

        productRepository.saveAll(products);
    }

    private Category createCategory(String name, String description, Admin admin) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setCreatedByAdmin(admin);
        return categoryRepository.save(category);
    }

    private Supplier createSupplier(String name, String email, String phone, String imageUrl, Admin admin) {
        Supplier supplier = new Supplier();
        supplier.setName(name);
        supplier.setContactEmail(email);
        supplier.setPhone(phone);
        supplier.setImageUrl(imageUrl);
        supplier.setCreatedByAdmin(admin);
        return supplierRepository.save(supplier);
    }

    private Product createProduct(
            String name,
            String description,
            String imageUrl,
            BigDecimal price,
            int quantity,
            Category category,
            Supplier supplier,
            Admin admin
    ) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setImageUrl(imageUrl);
        product.setPrice(price);
        product.setQuantityInStock(quantity);
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setCreatedByAdmin(admin);
        return product;
    }
}
