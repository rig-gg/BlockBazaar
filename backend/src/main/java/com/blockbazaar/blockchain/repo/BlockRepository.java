package com.blockbazaar.blockchain.repo;

import com.blockbazaar.blockchain.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BlockRepository extends JpaRepository<Block, Long> {
    List<Block> findBySenderWalletOrReceiverWallet(Integer senderWallet, Integer receiverWallet);
    Optional<Block> findTopByOrderByBlockIndexDesc();

    @Query("""
            SELECT b.blockIndex, b.timestamp, b.amount, b.type, b.hash,
                   COALESCE(su.username, 'System') AS senderName,
                   COALESCE(ru.username, 'System') AS receiverName
            FROM Block b
            LEFT JOIN Wallet sw ON b.senderWallet = sw.walletId
            LEFT JOIN User su ON sw.user = su
            LEFT JOIN Wallet rw ON b.receiverWallet = rw.walletId
            LEFT JOIN User ru ON rw.user = ru
            WHERE b.senderWallet = :walletId OR b.receiverWallet = :walletId
            ORDER BY b.blockIndex ASC
            """)
    List<Object[]> findTransactionsByWallet(@Param("walletId") Integer walletId);

    @Query("SELECT COALESCE(MAX(b.blockIndex), -1) FROM Block b")
    int findMaxBlockIndex();
}
