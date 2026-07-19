package com.blockbazaar.transactions.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferResponse {
    private String message;
    private String blockHash;
    private BigDecimal newBalance;
}
