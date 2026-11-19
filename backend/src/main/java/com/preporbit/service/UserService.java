package com.preporbit.service;

import com.preporbit.dto.AuthDTOs;
import com.preporbit.dto.UserDTOs;
import com.preporbit.exception.BadRequestException;
import com.preporbit.exception.ResourceNotFoundException;
import com.preporbit.model.User;
import com.preporbit.repository.UserRepository;
import com.preporbit.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User user = new User();
        user.setEmail(email);
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setTargetRole(request.getTargetRole() != null ? request.getTargetRole() : "Software Engineer");
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());

        return new AuthDTOs.AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getTargetRole());
    }

    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password.");
        }

        String token = jwtTokenProvider.generateTokenFromUserId(user.getId(), user.getEmail(), user.getFullName());
        return new AuthDTOs.AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getTargetRole());
    }

    public String handleForgotPassword(String email) {
        String cleanEmail = email.trim().toLowerCase();
        userRepository.findByEmail(cleanEmail);
        return "If an account with " + cleanEmail + " exists, a password reset link has been dispatched to your email address.";
    }

    public UserDTOs.UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDTOs.UserProfileResponse response = new UserDTOs.UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setTargetRole(user.getTargetRole());
        response.setSkills(user.getSkills());
        response.setEducation(user.getEducation());
        response.setBio(user.getBio());
        response.setProfilePictureUrl(user.getProfilePictureUrl());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }

    public UserDTOs.UserProfileResponse updateProfile(String userId, UserDTOs.UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName().trim());
        if (request.getTargetRole() != null) user.setTargetRole(request.getTargetRole().trim());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getEducation() != null) user.setEducation(request.getEducation().trim());
        if (request.getBio() != null) user.setBio(request.getBio().trim());
        if (request.getProfilePictureUrl() != null) user.setProfilePictureUrl(request.getProfilePictureUrl().trim());
        user.setUpdatedAt(Instant.now());

        User updated = userRepository.save(user);

        UserDTOs.UserProfileResponse response = new UserDTOs.UserProfileResponse();
        response.setId(updated.getId());
        response.setEmail(updated.getEmail());
        response.setFullName(updated.getFullName());
        response.setTargetRole(updated.getTargetRole());
        response.setSkills(updated.getSkills());
        response.setEducation(updated.getEducation());
        response.setBio(updated.getBio());
        response.setProfilePictureUrl(updated.getProfilePictureUrl());
        response.setCreatedAt(updated.getCreatedAt());

        return response;
    }
}
