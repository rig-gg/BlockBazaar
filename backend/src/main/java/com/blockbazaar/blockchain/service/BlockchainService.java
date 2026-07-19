package com.blockbazaar.blockchain.service;

import com.blockbazaar.blockchain.dto.ChainVerifyResponse;
import com.blockbazaar.blockchain.entity.Block;
import com.blockbazaar.blockchain.repo.BlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlockchainService {

    private static final String GENESIS_PREV_HASH = "0".repeat(64);

    private final BlockRepository blockRepository;

    public String computeHash(int blockIndex, LocalDateTime timestamp, int senderWallet,
                               int receiverWallet, BigDecimal amount, String type, String prevHash) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String data = blockIndex + timestamp.toString() + senderWallet + receiverWallet +
                    amount.toPlainString() + type + prevHash;
            byte[] hashBytes = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    public Block createBlock(int senderWallet, int receiverWallet, BigDecimal amount, String type) {
        int nextIndex = getNextBlockIndex();
        LocalDateTime now = LocalDateTime.now();
        String prevHash = getLatestBlockHash();

        String hash = computeHash(nextIndex, now, senderWallet, receiverWallet, amount, type, prevHash);

        Block block = Block.builder()
                .blockIndex(nextIndex)
                .timestamp(now)
                .senderWallet(senderWallet)
                .receiverWallet(receiverWallet)
                .amount(amount)
                .type(type)
                .prevHash(prevHash)
                .hash(hash)
                .build();

        return blockRepository.save(block);
    }

    public List<Block> getBlocksByWallet(Integer walletId) {
        return blockRepository.findBySenderWalletOrReceiverWallet(walletId, walletId);
    }

    private int getNextBlockIndex() {
        long count = blockRepository.count();
        return (int) count;
    }

    private String getLatestBlockHash() {
        Optional<Block> latest = blockRepository.findTopByOrderByBlockIndexDesc();
        return latest.map(Block::getHash).orElse(GENESIS_PREV_HASH);
    }

    public ChainVerifyResponse verifyChain() {
        List<Block> blocks = blockRepository.findAll();
        blocks.sort(Comparator.comparing(Block::getBlockIndex));

        if (blocks.isEmpty()) {
            ChainVerifyResponse response = new ChainVerifyResponse();
            response.setValid(true);
            response.setTotalBlocks(0);
            response.setMessage("Chain is empty.");
            return response;
        }

        for (int i = 0; i < blocks.size(); i++) {
            Block block = blocks.get(i);
            String expectedHash = computeHash(
                    block.getBlockIndex(),
                    block.getTimestamp(),
                    block.getSenderWallet(),
                    block.getReceiverWallet(),
                    block.getAmount(),
                    block.getType(),
                    block.getPrevHash()
            );

            if (!expectedHash.equals(block.getHash())) {
                ChainVerifyResponse response = new ChainVerifyResponse();
                response.setValid(false);
                response.setTotalBlocks(blocks.size());
                response.setTamperedAt(block.getBlockIndex());
                response.setMessage("Chain integrity compromised. Block at index " +
                        block.getBlockIndex() + " has been tampered with.");
                return response;
            }

            if (i > 0) {
                Block previous = blocks.get(i - 1);
                if (!previous.getHash().equals(block.getPrevHash())) {
                    ChainVerifyResponse response = new ChainVerifyResponse();
                    response.setValid(false);
                    response.setTotalBlocks(blocks.size());
                    response.setTamperedAt(block.getBlockIndex());
                    response.setMessage("Chain integrity compromised. Block at index " +
                            block.getBlockIndex() + " has been tampered with.");
                    return response;
                }
            }
        }

        ChainVerifyResponse response = new ChainVerifyResponse();
        response.setValid(true);
        response.setTotalBlocks(blocks.size());
        response.setMessage("Chain is valid. All " + blocks.size() + " blocks verified.");
        return response;
    }
}
