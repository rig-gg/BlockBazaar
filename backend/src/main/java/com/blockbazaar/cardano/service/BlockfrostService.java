package com.blockbazaar.cardano.service;

import com.blockbazaar.cardano.dto.CardanoNetworkResponse;
import com.blockbazaar.cardano.dto.CardanoTxResponse;
import com.blockbazaar.common.exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class BlockfrostService {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String projectId;

    public BlockfrostService(
            RestTemplate restTemplate,
            @Value("${blockfrost.api.url}") String apiUrl,
            @Value("${blockfrost.api.key}") String projectId) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.projectId = projectId;
    }

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("project_id", projectId);
        return headers;
    }

    public CardanoNetworkResponse getNetworkInfo() {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(headers());

            ResponseEntity<Map> networkResp = restTemplate.exchange(
                    apiUrl + "/network", HttpMethod.GET, entity, Map.class);

            ResponseEntity<Map> latestBlockResp = restTemplate.exchange(
                    apiUrl + "/blocks/latest", HttpMethod.GET, entity, Map.class);

            ResponseEntity<Map> latestEpochResp = restTemplate.exchange(
                    apiUrl + "/epochs/latest", HttpMethod.GET, entity, Map.class);

            Map block = latestBlockResp.getBody();
            Map epoch = latestEpochResp.getBody();

            CardanoNetworkResponse response = new CardanoNetworkResponse();
            response.setNetwork("cardano-mainnet");
            response.setHealth(true);

            CardanoNetworkResponse.LatestBlock latest = new CardanoNetworkResponse.LatestBlock();
            if (block != null) {
                latest.setHash((String) block.get("hash"));
                latest.setHeight(((Number) block.get("height")).intValue());
                latest.setSlot(((Number) block.get("slot")).longValue());
                latest.setTime((String) block.get("time"));
            }
            if (epoch != null) {
                latest.setEpoch(((Number) epoch.get("epoch")).intValue());
            }
            response.setLatestBlock(latest);

            CardanoNetworkResponse.Supply supply = new CardanoNetworkResponse.Supply();
            if (networkResp.getBody() != null) {
                supply.setTotal((String) networkResp.getBody().get("supply"));
            }
            response.setSupply(supply);

            return response;
        } catch (Exception e) {
            log.error("Failed to fetch Cardano network info: {}", e.getMessage());
            CardanoNetworkResponse fallback = new CardanoNetworkResponse();
            fallback.setNetwork("cardano-mainnet");
            fallback.setHealth(false);
            return fallback;
        }
    }

    public CardanoTxResponse getTransaction(String txHash) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(headers());

            ResponseEntity<Map> txResp = restTemplate.exchange(
                    apiUrl + "/txs/" + txHash, HttpMethod.GET, entity, Map.class);

            Map tx = txResp.getBody();
            if (tx == null) {
                throw new NotFoundException("Transaction not found: " + txHash);
            }

            CardanoTxResponse response = new CardanoTxResponse();
            response.setHash((String) tx.get("hash"));
            response.setBlock(((Number) tx.get("block")).intValue());
            response.setBlockHeight(((Number) tx.get("block_height")).intValue());
            response.setIndex(((Number) tx.get("index")).intValue());
            response.setFee(String.valueOf(tx.get("fees")));

            return response;
        } catch (HttpClientErrorException.NotFound e) {
            throw new NotFoundException("Transaction not found: " + txHash);
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to fetch Cardano transaction {}: {}", txHash, e.getMessage());
            throw new RuntimeException("Failed to fetch transaction from Cardano network");
        }
    }
}
