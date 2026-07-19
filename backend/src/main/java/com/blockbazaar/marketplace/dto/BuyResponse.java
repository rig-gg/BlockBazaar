package com.blockbazaar.marketplace.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BuyResponse {
    private String message;
    private Long itemId;
    private String itemName;
    private String blockHash;
    private BigDecimal newBalance;
}
