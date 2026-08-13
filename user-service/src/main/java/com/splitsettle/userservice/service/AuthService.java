package com.splitsettle.userservice.service;

import com.splitsettle.userservice.dto.AuthResponse;
import com.splitsettle.userservice.dto.LoginRequest;
import com.splitsettle.userservice.dto.RegisterRequest;
import com.splitsettle.userservice.entity.User;
import com.splitsettle.userservice.event.UserRegisteredEvent; // 🔥 Import add karo
import com.splitsettle.userservice.repository.UserRepository;
import com.splitsettle.userservice.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final KafkaProducerService kafkaProducerService; // 🔥 Yeh variable rakho

    // 🔥 CONSTRUCTOR KO YEH BANA DO (EventPublisher hata diya hai)
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager,
                       KafkaProducerService kafkaProducerService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.kafkaProducerService = kafkaProducerService; // 🔥 YEH LINE ADD KARO
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole(User.Role.USER);

        User saved = userRepository.save(user);

        // ✅ Direct KafkaProducerService use kar rahe hain
        kafkaProducerService.sendUserRegisteredEvent(new UserRegisteredEvent(saved.getId(), saved.getEmail(), saved.getFullName()));

        String token = jwtService.generateToken(saved.getEmail(), saved.getId(), saved.getRole().name());
        return new AuthResponse(token, saved.getId(), saved.getEmail(), saved.getFullName(), saved.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }
}