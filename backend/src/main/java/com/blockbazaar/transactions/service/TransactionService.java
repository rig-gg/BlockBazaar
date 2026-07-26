package com.blockbazaar.transactions.service;

import com.blockbazaar.auth.entity.User;
import com.blockbazaar.auth.repo.UserRepository;
import com.blockbazaar.blockchain.entity.Block;
import com.blockbazaar.blockchain.repo.BlockRepository;
import com.blockbazaar.blockchain.service.BlockchainService;
import com.blockbazaar.common.exception.ForbiddenException;
import com.blockbazaar.common.exception.NotFoundException;
import com.blockbazaar.transactions.dto.TransactionResponse;
import com.blockbazaar.transactions.dto.TransferRequest;
import com.blockbazaar.transactions.dto.TransferResponse;
import com.blockbazaar.wallet.entity.Wallet;
import com.blockbazaar.wallet.repo.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final BlockchainService blockchainService;
    private final BlockRepository blockRepository;

    @Transactional
    public TransferResponse transfer(Long senderUserId, TransferRequest request) {
        User sender = userRepository.findById(senderUserId)
                .orElseThrow(() -> new NotFoundException("Sender not found"));

        User receiver = userRepository.findByUsername(request.getReceiverUsername())
                .orElseThrow(() -> new NotFoundException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new ForbiddenException("Cannot transfer to yourself");
        }

        Wallet senderWallet = walletRepository.findByUserId(sender.getId())
                .orElseThrow(() -> new NotFoundException("Sender wallet not found"));

        Wallet receiverWallet = walletRepository.findByUserId(receiver.getId())
                .orElseThrow(() -> new NotFoundException("Receiver wallet not found"));

        if (senderWallet.getTokenBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        senderWallet.setTokenBalance(senderWallet.getTokenBalance().subtract(request.getAmount()));
        receiverWallet.setTokenBalance(receiverWallet.getTokenBalance().add(request.getAmount()));

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Block block = blockchainService.createBlock(
                senderWallet.getWalletId().intValue(),
                receiverWallet.getWalletId().intValue(),
                request.getAmount(),
                "Transfer"
        );

        TransferResponse response = new TransferResponse();
        response.setMessage("Transfer successful");
        response.setBlockHash(block.getHash());
        response.setNewBalance(senderWallet.getTokenBalance());

        return response;
    }

    public List<TransactionResponse> getTransactions(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Wallet not found"));

        Integer walletId = wallet.getWalletId().intValue();
        List<Object[]> rows = blockRepository.findTransactionsByWallet(walletId);

        List<TransactionResponse> transactions = new ArrayList<>();
        for (Object[] row : rows) {
            TransactionResponse tx = new TransactionResponse();
            tx.setBlockIndex((Integer) row[0]);
            tx.setTimestamp((java.time.LocalDateTime) row[1]);
            tx.setSender((String) row[5]);
            tx.setReceiver((String) row[6]);
            tx.setAmount((java.math.BigDecimal) row[2]);
            tx.setType((String) row[3]);
            tx.setHash((String) row[4]);
            transactions.add(tx);
        }

        return transactions;
    }
}
