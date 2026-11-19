package com.preporbit.controller;

import com.preporbit.dto.UserDTOs;
import com.preporbit.security.UserPrincipal;
import com.preporbit.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTOs.UserProfileResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(userService.getProfile(userPrincipal.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTOs.UserProfileResponse> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody UserDTOs.UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(userPrincipal.getId(), request));
    }
}
