package com.blockbazaar.blockchain.repo;

import com.blockbazaar.blockchain.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findByBlockIndex(Integer blockIndex);
    List<Block> findBySenderWalletOrReceiverWallet(Integer senderWallet, Integer receiverWallet);
    Optional<Block> findTopByOrderByBlockIndexDesc();
    long count();
}
