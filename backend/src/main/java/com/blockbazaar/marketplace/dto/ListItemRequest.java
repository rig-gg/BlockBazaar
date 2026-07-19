package com.blockbazaar.marketplace.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ListItemRequest {

    @NotBlank(message = "Item name is required")
    @Size(min = 1, max = 100, message = "Name must be 1-100 characters")
    private String name;

    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;
}
