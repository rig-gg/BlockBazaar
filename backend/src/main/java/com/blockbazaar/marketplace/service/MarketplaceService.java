package com.blockbazaar.marketplace.service;

import com.blockbazaar.auth.entity.User;
import com.blockbazaar.auth.repo.UserRepository;
import com.blockbazaar.blockchain.entity.Block;
import com.blockbazaar.blockchain.service.BlockchainService;
import com.blockbazaar.marketplace.dto.BuyResponse;
import com.blockbazaar.marketplace.dto.ItemResponse;
import com.blockbazaar.marketplace.dto.ListItemRequest;
import com.blockbazaar.marketplace.entity.Item;
import com.blockbazaar.marketplace.repo.ItemRepository;
import com.blockbazaar.wallet.entity.Wallet;
import com.blockbazaar.wallet.repo.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final BlockchainService blockchainService;

    public List<ItemResponse> getAvailableItems() {
        List<Item> items = itemRepository.findByStatus("Available");
        List<ItemResponse> responses = new ArrayList<>();
        for (Item item : items) {
            responses.add(toResponse(item));
        }
        return responses;
    }

    public List<ItemResponse> getMyItems(Long userId) {
        List<Item> items = itemRepository.findBySellerId(userId);
        List<ItemResponse> responses = new ArrayList<>();
        for (Item item : items) {
            responses.add(toResponse(item));
        }
        return responses;
    }

    private ItemResponse toResponse(Item item) {
        ItemResponse r = new ItemResponse();
        r.setItemId(item.getItemId());
        r.setName(item.getName());
        r.setPrice(item.getPrice());
        r.setSeller(item.getSeller().getUsername());
        r.setStatus(item.getStatus());
        r.setCreatedAt(item.getCreatedAt());
        return r;
    }

    @Transactional
    public ItemResponse listItem(Long userId, ListItemRequest request) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Item item = Item.builder()
                .name(request.getName())
                .price(request.getPrice())
                .seller(seller)
                .build();
        itemRepository.save(item);

        return toResponse(item);
    }

    @Transactional
    public BuyResponse buyItem(Long buyerUserId, Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if ("Sold".equals(item.getStatus())) {
            throw new RuntimeException("Item already sold");
        }

        if (item.getSeller().getId().equals(buyerUserId)) {
            throw new RuntimeException("Cannot buy your own item");
        }

        User buyer = userRepository.findById(buyerUserId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Wallet buyerWallet = walletRepository.findByUserId(buyer.getId())
                .orElseThrow(() -> new RuntimeException("Buyer wallet not found"));

        Wallet sellerWallet = walletRepository.findByUserId(item.getSeller().getId())
                .orElseThrow(() -> new RuntimeException("Seller wallet not found"));

        if (buyerWallet.getTokenBalance().compareTo(item.getPrice()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        buyerWallet.setTokenBalance(buyerWallet.getTokenBalance().subtract(item.getPrice()));
        sellerWallet.setTokenBalance(sellerWallet.getTokenBalance().add(item.getPrice()));

        walletRepository.save(buyerWallet);
        walletRepository.save(sellerWallet);

        item.setStatus("Sold");
        itemRepository.save(item);

        Block block = blockchainService.createBlock(
                buyerWallet.getWalletId().intValue(),
                sellerWallet.getWalletId().intValue(),
                item.getPrice(),
                "Purchase"
        );

        BuyResponse response = new BuyResponse();
        response.setMessage("Purchase successful");
        response.setItemId(item.getItemId());
        response.setItemName(item.getName());
        response.setBlockHash(block.getHash());
        response.setNewBalance(buyerWallet.getTokenBalance());

        return response;
    }
}
