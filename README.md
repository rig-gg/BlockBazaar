# BlockBazaar

**A blockchain-based marketplace token system for buying, selling, and transferring digital tokens securely.**

> **Course:** CSIT360 - INTRODUCTION TO BLOCKCHAIN
> **Submitted by:** Gyle M. Amihan, Karl Andrei B. Abriz, Kirsten Shane Baldon
> **Instructor:** John Quinnvic G. Taboada
> **Academic Year:** 2025–2026

BlockBazaar is a school project that demonstrates core blockchain concepts — cryptographic hashing, block chaining, and tamper detection — inside a working token marketplace. Rather than deploying to a live Ethereum/Polygon testnet, the project implements its own lightweight blockchain ledger, giving a full, verifiable audit trail for every token transaction while keeping the system buildable and demoable within a one-week sprint.

---

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [The Blockchain Ledger](#the-blockchain-ledger)
- [External API](#external-api)
- [The MKT Token](#the-mkt-token)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [User Stories](#user-stories)
- [Development Timeline](#development-timeline)
- [Future Enhancements](#future-enhancements)
- [Project Scope and Limitations](#project-scope-and-limitations)
- [Acknowledgments](#acknowledgments)

---

## Documentation

Detailed documentation lives in the [`docs/`](docs/) folder:

| Document | Description |
|----------|-------------|
| [Project Architecture](docs/PROJECT_ARCHITECTURE.md) | Full system design, directory structure, ER diagram, design decisions |
| [Sprint Plan](docs/SPRINT_PLAN.md) | Day-by-day task breakdown for 3 team members |
| [API Reference](docs/API_REFERENCE.md) | Complete endpoint documentation with request/response examples |
| [Database Schema](docs/DATABASE_SCHEMA.sql) | Ready-to-run SQL for PostgreSQL |
| [Getting Started](docs/GETTING_STARTED.md) | Setup instructions for backend, frontend, and database |
| [Contributing Guidelines](docs/CONTRIBUTING.md) | Git workflow, commit conventions, code standards |

---

## Overview

BlockBazaar is a marketplace application where users trade digital items using **MKT Tokens**, the platform's native marketplace token. Every transfer and purchase is recorded as a block in a self-built, SHA-256-hashed chain, persisted in a relational database, and can be independently re-verified at any time to prove the transaction history hasn't been altered.

The project demonstrates the interaction between three core layers:

| Layer | Role |
|---|---|
| **Blockchain Ledger** | Records and secures every token transaction as a chained, hashed block |
| **Database** | Persistent storage of users, wallets, items, and blocks |
| **Application** | Backend business logic and frontend user interface |

## Objectives

- Allow users to transfer marketplace tokens to other users
- Enable users to buy and sell digital marketplace items using tokens
- Record every transaction as a cryptographically linked block
- Provide a verification mechanism that proves the transaction history is untampered
- Demonstrate blockchain integration in a real, working application

## Features

### User Management
- User registration and login (JWT authentication)
- Automatic wallet creation on registration
- Token balance viewing

### Token Transactions
- Transfer tokens to another user
- View full transaction history
- Verify the integrity of the entire transaction chain on demand

### Marketplace
- List digital items for sale
- Browse marketplace listings
- Purchase items using MKT Tokens
- Automatic ownership transfer after a successful purchase

### Blockchain Ledger
- Every transaction (transfer or purchase) is stored as a block
- Each block is SHA-256 hashed and linked to the previous block's hash
- `/api/chain/verify` recomputes the chain and flags any tampering

### External API Integration
- Integration with an instructor-provided public API *(to be assigned)*

## System Architecture

```
                    User
                      |
                      v
                  Frontend (React)
                      |
                      v
                  Backend (Spring Boot)
                /               \
               v                 v
          Database          External API
       (PostgreSQL)      (instructor-assigned)
            |
      Blocks table
    (the blockchain ledger)
```

**Flow:** The frontend sends requests to the backend. The backend writes every transfer or purchase as a new hashed block, persists it to PostgreSQL, and can walk the full chain on demand to verify integrity. The instructor-assigned API is called for its designated purpose (e.g. data lookup, verification, or enrichment — details TBD once assigned).

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | ReactJS |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL (Supabase) |
| Hashing | SHA-256 (native chain implementation) |
| External API | Instructor-assigned (TBD) |
| Authentication | JWT |
| Version Control | Git & GitHub |

## Database Schema

### `users`
| Field | Description |
|---|---|
| `id` | User ID (primary key) |
| `username` | Username |
| `email` | User email |
| `password_hash` | Encrypted password hash |

### `wallets`
| Field | Description |
|---|---|
| `wallet_id` | Wallet ID (primary key) |
| `user_id` | Owner of wallet (FK → users) |
| `token_balance` | Current MKT token balance |

### `items`
| Field | Description |
|---|---|
| `item_id` | Item ID (primary key) |
| `name` | Item name |
| `price` | Price in MKT tokens |
| `seller_id` | Seller ID (FK → users) |
| `status` | `Available` or `Sold` |

### `blocks`
| Field | Description |
|---|---|
| `block_id` | Block ID (primary key) |
| `block_index` | Position in the chain |
| `timestamp` | Time the block was created |
| `sender_wallet` | Sender wallet ID |
| `receiver_wallet` | Receiver wallet ID |
| `amount` | Number of tokens moved |
| `type` | `Transfer` or `Purchase` |
| `prev_hash` | Hash of the previous block |
| `hash` | SHA-256 hash of this block's contents + `prev_hash` |

## The Blockchain Ledger

Every transfer and purchase writes one new row to `blocks`. Each block's hash is computed from its own contents plus the previous block's hash:

```
hash = SHA256(index + timestamp + sender_wallet + receiver_wallet + amount + prev_hash)
```

This chains every transaction to the one before it. Calling `GET /api/chain/verify` walks the entire table, recomputes each hash, and compares it against the stored value — if any block has been altered, the mismatch is immediately visible, proving the ledger's tamper-evidence.

## External API

| API | Purpose |
|---|---|
| *(Instructor-assigned, TBD)* | To be determined once assigned — integrated into the dashboard or transaction flow as appropriate |

## The MKT Token

BlockBazaar uses its own marketplace token: **MKT Token**. MKT can be used for:
- Buying marketplace items
- Selling marketplace items
- Transferring tokens to other users

## Getting Started

### Prerequisites

- Java 17+ and Maven (backend)
- Node.js 18+ and npm (frontend)
- Supabase PostgreSQL project (or local PostgreSQL 15+)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/blockbazaar.git
cd blockbazaar

# 2. Set up the database
# Run schema.sql as provided in /backend/src/main/resources

# 3. Configure environment variables
cp .env.example .env
# Fill in: DB credentials, JWT secret, external API key (once assigned)

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
| `EXTERNAL_API_KEY` | API key for the instructor-assigned external API |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (auto-creates a wallet) |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/wallet` | View the user's wallet and balance |
| `POST` | `/api/transactions/transfer` | Transfer tokens to another user |
| `GET` | `/api/transactions` | View transaction history |
| `GET` | `/api/chain/verify` | Recompute and verify the entire block chain |
| `GET` | `/api/marketplace/items` | Browse marketplace listings |
| `POST` | `/api/marketplace/items` | List an item for sale |
| `POST` | `/api/marketplace/items/{id}/buy` | Purchase an item with MKT |

## User Stories

- As a user, I can transfer tokens to another user
- As a user, I can buy marketplace items using tokens
- As a seller, I can list items for sale
- As a user, I can view my transaction history
- As a user, I can verify that the transaction ledger hasn't been tampered with
- As a user, I benefit from data provided by the integrated external API

## Development Timeline

**Duration:** 1 week | **Team:** 3 members

| Day | Focus | Deliverables |
|---|---|---|
| 1 | Setup & Auth | Repo scaffolding (Spring Boot + React + PostgreSQL), JWT register/login, `users` & `wallets` tables |
| 2 | Blockchain Core | `blocks` table, SHA-256 hashing + chaining logic, `/api/chain/verify` endpoint |
| 3 | Wallet & Transfers | Balance endpoint, token transfer endpoint, transfer UI |
| 4 | Marketplace | Item listing, browse, and buy endpoints; marketplace UI |
| 5 | External API & History | Instructor-assigned API integration, transaction history endpoint + UI, "Verify Chain" UI |
| 6 | Integration & Polish | End-to-end testing, bug fixes, UI cleanup, documentation |
| 7 | Buffer & Submission | Bug buffer, demo prep, final submission |

**Team Split**
- **Gyle (Backend Lead):** Blockchain core, hashing logic, chain verification, DB schema, marketplace backend
- **Karl (Full-stack):** Auth system, wallet endpoints, transaction logic, Spring Boot config, external API
- **Kirsten (Frontend Lead):** React app, all UI pages, API integration, styling, responsive design

## Future Enhancements

- Migration to a live Ethereum/Polygon testnet with ERC-20 smart contracts
- Multiple wallets per user with self-transfer support
- NFT marketplace support
- Mobile application support
- Marketplace reputation system

## Project Scope and Limitations

This project was developed for academic purposes to demonstrate blockchain integration concepts within a one-week timeframe. As such:

- Blockchain functionality is implemented as a self-built, SHA-256-hashed chain rather than deployed to a live network — no real cryptocurrency or monetary value is involved
- External API usage is limited to a single free-tier service
- The system is intended for demonstration and evaluation, not production deployment

## Acknowledgments

- John Quinnvic G. Taboada for guidance throughout the project
- Course materials from CSIT360
- Documentation from Spring Boot, React, and PostgreSQL communities

---

*BlockBazaar demonstrates how core blockchain principles — hashing, chaining, and tamper detection — can be implemented and verified in a working marketplace system, built and delivered within a one-week sprint.*
