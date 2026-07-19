-- BlockBazaar Database Schema
-- PostgreSQL (Supabase or local)

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50) UNIQUE NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- WALLETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wallets (
    wallet_id      SERIAL PRIMARY KEY,
    user_id        INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_balance  DECIMAL(12, 2) DEFAULT 100.00 NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_balance CHECK (token_balance >= 0)
);

-- ============================================
-- ITEMS TABLE (Marketplace)
-- ============================================
CREATE TABLE IF NOT EXISTS items (
    item_id    SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    price      DECIMAL(12, 2) NOT NULL CHECK (price > 0),
    seller_id  INTEGER NOT NULL REFERENCES users(id),
    status     VARCHAR(10) DEFAULT 'Available' CHECK (status IN ('Available', 'Sold')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BLOCKS TABLE (Blockchain Ledger)
-- ============================================
CREATE TABLE IF NOT EXISTS blocks (
    block_id         SERIAL PRIMARY KEY,
    block_index      INTEGER NOT NULL UNIQUE,
    timestamp        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sender_wallet    INTEGER NOT NULL,
    receiver_wallet  INTEGER NOT NULL,
    amount           DECIMAL(12, 2) NOT NULL,
    type             VARCHAR(20) NOT NULL CHECK (type IN ('Transfer', 'Purchase')),
    prev_hash        VARCHAR(64) NOT NULL,
    hash             VARCHAR(64) NOT NULL
);

-- ============================================
-- INDEXES (for performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_items_seller_id ON items(seller_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_blocks_index ON blocks(block_index);
CREATE INDEX IF NOT EXISTS idx_blocks_sender ON blocks(sender_wallet);
CREATE INDEX IF NOT EXISTS idx_blocks_receiver ON blocks(receiver_wallet);

-- ============================================
-- GENESIS BLOCK (first block in the chain)
-- ============================================
INSERT INTO blocks (block_index, timestamp, sender_wallet, receiver_wallet, amount, type, prev_hash, hash)
VALUES (
    0,
    CURRENT_TIMESTAMP,
    0,
    0,
    0.00,
    'Transfer',
    '0000000000000000000000000000000000000000000000000000000000000000',
    'genesis-block-hash-replaced-at-runtime'
);
