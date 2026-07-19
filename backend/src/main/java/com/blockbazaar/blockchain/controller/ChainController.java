package com.blockbazaar.blockchain.controller;

import com.blockbazaar.blockchain.dto.ChainVerifyResponse;
import com.blockbazaar.blockchain.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chain")
@RequiredArgsConstructor
public class ChainController {

    private final BlockchainService blockchainService;

    @GetMapping("/verify")
    public ResponseEntity<ChainVerifyResponse> verifyChain() {
        ChainVerifyResponse response = blockchainService.verifyChain();
        return ResponseEntity.ok(response);
    }
}
