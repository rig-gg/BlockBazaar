package com.blockbazaar.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Login identifier is required")
    private String loginIdentifier;

    @NotBlank(message = "Password is required")
    private String password;
}
