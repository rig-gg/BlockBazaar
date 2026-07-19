package com.blockbazaar.wallet.controller;

import com.blockbazaar.security.JwtAuthFilter;
import com.blockbazaar.wallet.dto.WalletResponse;
import com.blockbazaar.wallet.entity.Wallet;
import com.blockbazaar.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet(@RequestHeader("Authorization") String authHeader) {
        Long userId = JwtAuthFilter.extractUserId(authHeader);
        Wallet wallet = walletService.getWalletByUserId(userId);

        WalletResponse response = new WalletResponse();
        response.setWalletId(wallet.getWalletId());
        response.setUserId(wallet.getUser().getId());
        response.setBalance(wallet.getTokenBalance());

        return ResponseEntity.ok(response);
    }
}
