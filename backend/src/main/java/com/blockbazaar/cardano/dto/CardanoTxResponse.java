package com.blockbazaar.cardano.dto;

import lombok.Data;

@Data
public class CardanoTxResponse {
    private String hash;
    private int block;
    private int blockHeight;
    private int index;
    private String inputSum;
    private String outputSum;
    private String fee;
    private int inputCount;
    private int outputCount;
}
