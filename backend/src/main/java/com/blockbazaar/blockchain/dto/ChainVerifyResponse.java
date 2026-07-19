package com.blockbazaar.blockchain.dto;

import lombok.Data;

@Data
public class ChainVerifyResponse {
    private boolean valid;
    private int totalBlocks;
    private Integer tamperedAt;
    private String message;
}
