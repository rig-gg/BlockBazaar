package com.blockbazaar.cardano.controller;

import com.blockbazaar.cardano.dto.CardanoNetworkResponse;
import com.blockbazaar.cardano.dto.CardanoTxResponse;
import com.blockbazaar.cardano.service.BlockfrostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cardano")
@RequiredArgsConstructor
public class CardanoController {

    private final BlockfrostService blockfrostService;

    @GetMapping("/network")
    public ResponseEntity<CardanoNetworkResponse> getNetworkInfo() {
        CardanoNetworkResponse response = blockfrostService.getNetworkInfo();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tx/{hash}")
    public ResponseEntity<CardanoTxResponse> getTransaction(@PathVariable("hash") String txHash) {
        CardanoTxResponse response = blockfrostService.getTransaction(txHash);
        return ResponseEntity.ok(response);
    }
}
