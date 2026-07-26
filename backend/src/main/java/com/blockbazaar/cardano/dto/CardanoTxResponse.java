package com.blockbazaar.cardano.dto;

import lombok.Data;

@Data
public class CardanoTxResponse {
    private String hash;
    private int blockHeight;
    private int index;
    private long blockTime;
    private int slot;
    private String outputSum;
    private String fee;
    private int inputCount;
    private int outputCount;
}
