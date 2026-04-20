package com.example.tp_backend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.tp_backend.dto.AuthTokenResponse;
import com.example.tp_backend.dto.AuthUserResponse;
import com.example.tp_backend.dto.LoginRequest;
import com.example.tp_backend.dto.RegisterUserRequest;
import com.example.tp_backend.exception.NotFoundException;
import com.example.tp_backend.security.AppUser;
import com.example.tp_backend.security.AppUserRepository;
import com.example.tp_backend.security.JwtService;
import com.example.tp_backend.security.Role;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthTokenResponse registerUser(RegisterUserRequest request) {
        String username = requireText(request.username(), "username");
        String email = requireText(request.email(), "email");
        String password = requireText(request.password(), "password");

        if (appUserRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        if (appUserRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);

        user = appUserRepository.save(user);
        return toTokenResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthTokenResponse login(LoginRequest request) {
        String username = requireText(request.username(), "username");
        String password = requireText(request.password(), "password");

        AppUser user = appUserRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new NotFoundException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new NotFoundException("Invalid username or password");
        }

        if (!user.isEnabled()) {
            throw new IllegalArgumentException("User account is disabled");
        }

        return toTokenResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthUserResponse currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return null;
        }

        AppUser user = appUserRepository.findByUsernameIgnoreCase(authentication.getName())
                .orElseThrow(() -> new NotFoundException("Authenticated user not found"));

        return toResponse(user);
    }

    private AuthUserResponse toResponse(AppUser user) {
        return new AuthUserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }

    private AuthTokenResponse toTokenResponse(AppUser user) {
        String token = jwtService.generateToken(user);
        return new AuthTokenResponse("Bearer", token, jwtService.getExpirationMs(), toResponse(user));
    }

    private String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
        return value.trim();
    }
}
