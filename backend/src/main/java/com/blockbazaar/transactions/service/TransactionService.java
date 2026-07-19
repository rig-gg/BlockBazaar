package com.blockbazaar.transactions.service;

import com.blockbazaar.auth.entity.User;
import com.blockbazaar.auth.repo.UserRepository;
import com.blockbazaar.blockchain.entity.Block;
import com.blockbazaar.blockchain.service.BlockchainService;
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

    @Transactional
    public TransferResponse transfer(Long senderUserId, TransferRequest request) {
        User sender = userRepository.findById(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findByUsername(request.getReceiverUsername())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Cannot transfer to yourself");
        }

        Wallet senderWallet = walletRepository.findByUserId(sender.getId())
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet receiverWallet = walletRepository.findByUserId(receiver.getId())
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        if (senderWallet.getTokenBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
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
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        Integer walletId = wallet.getWalletId().intValue();
        List<Block> blocks = blockchainService.getBlocksByWallet(walletId);

        List<TransactionResponse> transactions = new ArrayList<>();
        for (Block block : blocks) {
            User sender = findUserByWalletId(block.getSenderWallet());
            User receiver = findUserByWalletId(block.getReceiverWallet());

            TransactionResponse tx = new TransactionResponse();
            tx.setBlockIndex(block.getBlockIndex());
            tx.setTimestamp(block.getTimestamp());
            tx.setSender(sender != null ? sender.getUsername() : "System");
            tx.setReceiver(receiver != null ? receiver.getUsername() : "System");
            tx.setAmount(block.getAmount());
            tx.setType(block.getType());
            tx.setHash(block.getHash());
            transactions.add(tx);
        }

        return transactions;
    }

    private User findUserByWalletId(Integer walletId) {
        return walletRepository.findById(walletId.longValue())
                .map(Wallet::getUser)
                .orElse(null);
    }
}
