package com.blockbazaar.wallet.service;

import com.blockbazaar.wallet.entity.Wallet;
import com.blockbazaar.wallet.repo.WalletRepository;
import com.blockbazaar.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;

    public Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Wallet not found"));
    }
}
