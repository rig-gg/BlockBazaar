package com.blockbazaar.transactions.controller;

import com.blockbazaar.security.JwtAuthFilter;
import com.blockbazaar.transactions.dto.TransactionResponse;
import com.blockbazaar.transactions.dto.TransferRequest;
import com.blockbazaar.transactions.dto.TransferResponse;
import com.blockbazaar.transactions.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<TransferResponse> transfer(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TransferRequest request) {
        Long userId = JwtAuthFilter.extractUserId(authHeader);
        TransferResponse response = transactionService.transfer(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, List<TransactionResponse>>> getTransactions(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = JwtAuthFilter.extractUserId(authHeader);
        List<TransactionResponse> transactions = transactionService.getTransactions(userId);
        return ResponseEntity.ok(Map.of("transactions", transactions));
    }
}
