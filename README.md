# BlockBazaar

**A blockchain-based marketplace token system for buying, selling, and transferring digital tokens securely.**

> **Course:** CSIT360 - INTRODUCTION TO BLOCKCHAIN
> **Submitted by:** Gyle M. Amihan
> **Instructor:** John Quinnvic G. Taboada
> **Academic Year:** 2025–2026

BlockBazaar is a school project that integrates blockchain token transactions with a traditional database and external APIs to deliver a complete marketplace experience. It demonstrates how blockchain technology can work alongside conventional application infrastructure in a real-world system.

---

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [External APIs](#external-apis)
- [The MKT Token](#the-mkt-token)
- [Use Cases](#use-cases)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [User Stories](#user-stories)
- [Future Enhancements](#future-enhancements)
- [Project Scope and Limitations](#project-scope-and-limitations)
- [Acknowledgments](#acknowledgments)

---

## Overview

BlockBazaar is a marketplace application where users trade digital items using **MKT Tokens**, the platform's native marketplace token. Every token transfer is recorded on the blockchain, persisted in a relational database, and verified through external APIs.

The project demonstrates the interaction between four core layers:

| Layer | Role |
|---|---|
| **Blockchain** | Executes and secures token transfers |
| **Database** | Persistent storage of users, wallets, items, and transactions |
| **External APIs** | Transaction verification, token prices, wallet validation |
| **Application** | Backend business logic and frontend user interface |

## Objectives

- Allow users to transfer marketplace tokens to other users
- Allow users to transfer tokens between their own wallets
- Enable users to buy and sell digital marketplace items using tokens
- Record all transactions in a database
- Verify blockchain transactions using external APIs
- Demonstrate blockchain integration in a real-world application

## Features

### User Management
- User registration and login (JWT authentication)
- Wallet creation, with support for multiple wallets per user
- Token balance viewing across all wallets

### Token Transactions
- Transfer tokens to another user
- Transfer tokens between personal wallets (self-transfer)
- View full transaction history
- View live transaction status

### Marketplace
- List digital items for sale
- Purchase items using MKT Tokens
- Browse marketplace listings
- Automatic ownership transfer after successful purchase

### Blockchain Integration
- Blockchain-based token transfers
- Smart contract interaction (ERC-20)
- Wallet address validation
- Transaction hash generation

### External API Integration
- Retrieve live token prices
- Verify blockchain transactions
- Validate wallet addresses
- Display transaction confirmations

## System Architecture

```
                    User
                      |
                      v
                  Frontend (React)
                      |
                      v
                  Backend (Spring Boot)
                /       |        \
               /        |         \
              v         v          v
        Database   External APIs  Blockchain
       (PostgreSQL)     |        (Ethereum/Polygon)
            |           |            |
     Stores records  Validates   Transfers
                       data        tokens
```

**Flow:** The frontend sends requests to the backend. The backend coordinates three subsystems: it persists records to the database, calls external APIs for validation and pricing, and submits token transfers to the blockchain.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | ReactJS |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL |
| Blockchain | Ethereum or Polygon |
| Token Standard | ERC-20 |
| API Integration | REST APIs |
| Authentication | JWT |
| Version Control | Git & GitHub |

## Database Schema

### `users`
| Field | Description |
|---|---|
| `id` | User ID (primary key) |
| `username` | Username |
| `email` | User email |
| `password` | Encrypted password hash |

### `wallets`
| Field | Description |
|---|---|
| `wallet_id` | Wallet ID (primary key) |
| `user_id` | Owner of wallet (FK → users) |
| `wallet_address` | Blockchain wallet address |
| `token_balance` | Current MKT token balance |

### `marketplace_items`
| Field | Description |
|---|---|
| `item_id` | Item ID (primary key) |
| `item_name` | Item name |
| `price` | Price in MKT tokens |
| `seller_id` | Seller ID (FK → users) |
| `status` | `Available` or `Sold` |

### `transactions`
| Field | Description |
|---|---|
| `transaction_id` | Transaction ID (primary key) |
| `sender_wallet` | Sender wallet address |
| `receiver_wallet` | Receiver wallet address |
| `amount` | Number of tokens transferred |
| `transaction_type` | `Purchase` or `Transfer` |
| `status` | `Successful` or `Failed` |
| `timestamp` | Date and time of transaction |

## External APIs

| API | Purpose |
|---|---|
| CoinGecko API | Retrieve token prices |
| Blockchain Explorer API | Verify blockchain transactions |
| Wallet Validation API | Validate wallet addresses |
| QR Code API | Generate wallet QR codes |

## The MKT Token

BlockBazaar uses its own ERC-20 marketplace token: **MKT Token**.

MKT can be used for:
- Buying marketplace items
- Selling marketplace items
- Transferring tokens to other users
- Transferring tokens between personal wallets

## Use Cases

### 1. Transfer Tokens to Another User

```
User A → Transfers 50 MKT → Blockchain Transaction → User B Receives Tokens → Database Stores Transaction
```

### 2. Self Wallet Transfer

A user may own multiple wallets and move tokens between them:

```
Personal Wallet (100 MKT) → 50 MKT → Gaming Wallet (0 MKT)
```

The system records the transaction on both the blockchain and the database.

### 3. Buying an Item

```
User selects item
      → Marketplace validates purchase
      → API verifies wallet information
      → Blockchain transfers tokens
      → Seller receives payment
      → Database updates ownership
```

## Getting Started

### Prerequisites

- Java 17+ and Maven (backend)
- Node.js 18+ and npm (frontend)
- PostgreSQL 15+
- MetaMask or another Web3 wallet (for testnet interaction)
- Testnet funds (e.g., Polygon Amoy / Ethereum Sepolia faucet)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/blockbazaar.git
cd blockbazaar

# 2. Set up the database
createdb blockbazaar
# Run migrations / schema.sql as provided in /backend/src/main/resources

# 3. Configure environment variables
cp .env.example .env
# Fill in: DB credentials, JWT secret, RPC URL, contract address, API keys

# 4. Start the backend
cd backend
./mvnw spring-boot:run

# 5. Start the frontend
cd ../frontend
npm install
npm start
```

The app will be available at `http://localhost:3000` (frontend) with the API at `http://localhost:8080`.

### Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL connection string |
| `DB_USER` / `DB_PASSWORD` | Database credentials |
| `JWT_SECRET` | Secret key for signing JWTs |
| `BLOCKCHAIN_RPC_URL` | Ethereum/Polygon RPC endpoint |
| `MKT_CONTRACT_ADDRESS` | Deployed ERC-20 contract address |
| `COINGECKO_API_KEY` | API key for token price lookups |
| `EXPLORER_API_KEY` | Blockchain explorer API key |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `POST` | `/api/wallets` | Create a new wallet |
| `GET` | `/api/wallets` | List the user's wallets and balances |
| `POST` | `/api/transactions/transfer` | Transfer tokens to another user |
| `POST` | `/api/transactions/self-transfer` | Transfer between own wallets |
| `GET` | `/api/transactions` | View transaction history |
| `GET` | `/api/transactions/{id}/status` | Check a transaction's status |
| `GET` | `/api/marketplace/items` | Browse marketplace listings |
| `POST` | `/api/marketplace/items` | List an item for sale |
| `POST` | `/api/marketplace/items/{id}/buy` | Purchase an item with MKT |

## User Stories

- As a user, I can transfer tokens to another user
- As a user, I can transfer tokens between my own wallets
- As a user, I can buy marketplace items using tokens
- As a seller, I can list items for sale
- As a user, I can view my transaction history
- As a user, I can verify blockchain transactions
- As a user, I can view my token balances across multiple wallets

## Future Enhancements

- Escrow smart contracts
- NFT marketplace support
- Mobile application support
- Token staking rewards
- Marketplace reputation system
- Multi-chain blockchain support
- Real-time transaction tracking

## Project Scope and Limitations

This project was developed for academic purposes to demonstrate blockchain integration concepts. As such:

- The application runs on a blockchain **testnet** (no real cryptocurrency or monetary value is involved)
- External API usage is limited to free-tier services
- The system is intended for demonstration and evaluation, not production deployment

## Acknowledgments

- John Quinnvic G. Taboada for guidance throughout the project
- Course materials from CSIT360
- Documentation from Ethereum, Spring Boot, React, and PostgreSQL communities

---

*BlockBazaar demonstrates how blockchain technology can be integrated with traditional databases and external APIs to create a secure and transparent token-based marketplace system.*
