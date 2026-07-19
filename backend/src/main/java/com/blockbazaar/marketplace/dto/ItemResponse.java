package com.blockbazaar.marketplace.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemResponse {
    private Long itemId;
    private String name;
    private BigDecimal price;
    private String seller;
    private String status;
}
