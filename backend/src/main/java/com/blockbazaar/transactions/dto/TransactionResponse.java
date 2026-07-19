package com.blockbazaar.transactions.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {
    private Integer blockIndex;
    private LocalDateTime timestamp;
    private String sender;
    private String receiver;
    private BigDecimal amount;
    private String type;
    private String hash;
}
