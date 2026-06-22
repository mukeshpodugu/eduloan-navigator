package com.eduloan.navigator.service;

import com.eduloan.navigator.dto.RegisterRequest;
import com.eduloan.navigator.model.Role;
import com.eduloan.navigator.model.User;
import com.eduloan.navigator.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email Address already in use!");
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail(),
                Role.ROLE_USER
        );

        return userRepository.save(user);
    }

    @PostConstruct
    public void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("admin123"),
                    "admin@eduloan.com",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
        }
    }
}
