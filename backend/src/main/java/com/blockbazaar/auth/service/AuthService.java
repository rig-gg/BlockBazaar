package com.blockbazaar.auth.service;

import com.blockbazaar.auth.dto.AuthResponse;
import com.blockbazaar.auth.dto.LoginRequest;
import com.blockbazaar.auth.dto.RegisterRequest;
import com.blockbazaar.auth.entity.User;
import com.blockbazaar.auth.repo.UserRepository;
import com.blockbazaar.security.JwtUtil;
import com.blockbazaar.wallet.entity.Wallet;
import com.blockbazaar.wallet.repo.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);

        Wallet wallet = Wallet.builder().user(user).build();
        walletRepository.save(wallet);

        String token = JwtUtil.generateToken(user.getId(), user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findByUsername(request.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = JwtUtil.generateToken(user.getId(), user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }
}
