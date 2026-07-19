package com.blockbazaar.marketplace.repo;

import com.blockbazaar.marketplace.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByStatus(String status);
    List<Item> findBySellerId(Long sellerId);
}
