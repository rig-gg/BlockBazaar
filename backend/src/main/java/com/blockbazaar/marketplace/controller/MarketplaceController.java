package com.blockbazaar.marketplace.controller;

import com.blockbazaar.marketplace.dto.BuyResponse;
import com.blockbazaar.marketplace.dto.ItemResponse;
import com.blockbazaar.marketplace.dto.ListItemRequest;
import com.blockbazaar.marketplace.service.MarketplaceService;
import com.blockbazaar.security.JwtAuthFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    @GetMapping("/items")
    public ResponseEntity<Map<String, List<ItemResponse>>> getItems() {
        List<ItemResponse> items = marketplaceService.getAvailableItems();
        return ResponseEntity.ok(Map.of("items", items));
    }

    @GetMapping("/items/mine")
    public ResponseEntity<Map<String, List<ItemResponse>>> getMyItems(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = JwtAuthFilter.extractUserId(authHeader);
        List<ItemResponse> items = marketplaceService.getMyItems(userId);
        return ResponseEntity.ok(Map.of("items", items));
    }

    @PostMapping("/items")
    public ResponseEntity<Map<String, Object>> listItem(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ListItemRequest request) {
        Long userId = JwtAuthFilter.extractUserId(authHeader);
        ItemResponse item = marketplaceService.listItem(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "itemId", item.getItemId(),
                "name", item.getName(),
                "price", item.getPrice(),
                "message", "Item listed successfully"
        ));
    }

    @PostMapping("/items/{id}/buy")
    public ResponseEntity<BuyResponse> buyItem(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("id") Long itemId) {
        Long userId = JwtAuthFilter.extractUserId(authHeader);
        BuyResponse response = marketplaceService.buyItem(userId, itemId);
        return ResponseEntity.ok(response);
    }
}
