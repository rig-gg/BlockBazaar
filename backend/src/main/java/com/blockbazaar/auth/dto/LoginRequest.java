package com.blockbazaar.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @JsonAlias("email")
    @NotBlank(message = "Login identifier is required")
    private String loginIdentifier;

    @NotBlank(message = "Password is required")
    private String password;
}
