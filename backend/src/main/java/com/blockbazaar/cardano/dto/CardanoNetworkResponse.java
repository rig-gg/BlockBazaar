package com.blockbazaar.cardano.dto;

import lombok.Data;

@Data
public class CardanoNetworkResponse {
    private String network;
    private LatestBlock latestBlock;
    private Supply supply;
    private boolean health;

    @Data
    public static class LatestBlock {
        private String hash;
        private int height;
        private long slot;
        private int epoch;
        private String time;
    }

    @Data
    public static class Supply {
        private Long total;
        private Long circulating;
    }
}
