# BlockBazaar - Project Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                    ReactJS Single Page App                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   Auth   │ │ Dashboard│ │Marketplace│ │  Chain   │           │
│  │  Pages   │ │  & Wallet│ │  Browse  │ │ Verify   │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Spring Boot)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    REST Controllers                       │   │
│  │  AuthController │ WalletController │ TransactionController│  │
│  │  MarketplaceController │ ChainController │ CardanoController│ │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                     Services Layer                        │   │
│  │  AuthService │ WalletService │ TransactionService         │   │
│  │  MarketplaceService │ BlockchainService │ BlockfrostService│  │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                  Repository Layer (JPA)                   │   │
│  │  UserRepository │ WalletRepository │ ItemRepository       │   │
│  │  BlockRepository                                         │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │               Security & Exception Handling               │   │
│  │  JwtAuthFilter → SecurityContextHolder                    │   │
│  │  GlobalExceptionHandler → custom exceptions (401/403/     │   │
│  │    404/409/422/500) → clean JSON responses                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────────┬───────────────────────┘
           │ JDBC/JPA                     │ HTTPS
           ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│  PostgreSQL (Supabase)│    │     Blockfrost API            │
│  ┌────────┐ ┌────────┐│    │     (Cardano Mainnet)         │
│  │ users  │ │wallets ││    │  ┌──────────┐ ┌───────────┐  │
│  └────────┘ └────────┘│    │  │ /network │ │ /txs/{hash}│  │
│  ┌────────┐ ┌────────┐│    │  └──────────┘ └───────────┘  │
│  │ items  │ │ blocks ││←───│  (blockchain ledger)          │
│  └────────┘ └────────┘│    └──────────────────────────────┘
└──────────────────────┘
```

---

## Directory Structure

```
BlockBazaar/
├── backend/
│   ├── .env                          ← real credentials (gitignored)
│   ├── .env.example                  ← placeholder values for setup
│   ├── .mvn/wrapper/
│   ├── mvnw / mvnw.cmd
│   ├── pom.xml
│   └── src/main/
│       ├── resources/
│       │   ├── application.properties
│       │   └── schema.sql
│       └── java/com/blockbazaar/
│           ├── BlockBazaarApplication.java
│           ├── config/
│           │   └── SecurityConfig.java
│           ├── security/
│           │   ├── JwtUtil.java
│           │   ├── JwtAuthFilter.java
│           │   └── UserPrincipal.java
│           ├── common/exception/
│           │   ├── GlobalExceptionHandler.java
│           │   ├── NotFoundException.java
│           │   ├── UnauthorizedException.java
│           │   ├── ConflictException.java
│           │   └── ForbiddenException.java
│           ├── auth/
│           │   ├── entity/User.java
│           │   ├── repo/UserRepository.java
│           │   ├── service/AuthService.java
│           │   ├── controller/AuthController.java
│           │   └── dto/
│           │       ├── RegisterRequest.java
│           │       ├── LoginRequest.java
│           │       └── AuthResponse.java
│           ├── wallet/
│           │   ├── entity/Wallet.java
│           │   ├── repo/WalletRepository.java
│           │   ├── service/WalletService.java
│           │   ├── controller/WalletController.java
│           │   └── dto/WalletResponse.java
│           ├── blockchain/
│           │   ├── entity/Block.java
│           │   ├── repo/BlockRepository.java
│           │   ├── service/BlockchainService.java
│           │   ├── controller/ChainController.java
│           │   └── dto/ChainVerifyResponse.java
│           ├── transactions/
│           │   ├── service/TransactionService.java
│           │   ├── controller/TransactionController.java
│           │   └── dto/
│           │       ├── TransferRequest.java
│           │       ├── TransferResponse.java
│           │       └── TransactionResponse.java
│           ├── marketplace/
│           │   ├── entity/Item.java
│           │   ├── repo/ItemRepository.java
│           │   ├── service/MarketplaceService.java
│           │   ├── controller/MarketplaceController.java
│           │   └── dto/
│           │       ├── ListItemRequest.java
│           │       ├── ItemResponse.java
│           │       └── BuyResponse.java
│           └── cardano/
│               ├── service/BlockfrostService.java
│               ├── controller/CardanoController.java
│               └── dto/
│                   ├── CardanoNetworkResponse.java
│                   └── CardanoTxResponse.java
├── frontend/
│   ├── .env                          ← REACT_APP_* vars
│   ├── package.json
│   └── src/
│       ├── index.js / index.css
│       ├── App.js / App.css
│       ├── services/api.js
│       ├── context/AuthContext.js
│       ├── components/
│       │   ├── Navbar.js
│       │   └── ProtectedRoute.js
│       └── pages/
│           ├── Login.js
│           ├── Register.js
│           ├── Dashboard.js
│           ├── Transfer.js
│           ├── Transactions.js
│           ├── Marketplace.js
│           ├── MyListings.js
│           └── ChainVerify.js
├── docs/
│   ├── PROJECT_ARCHITECTURE.md
│   ├── SPRINT_PLAN.md
│   ├── API_REFERENCE.md
│   ├── DATABASE_SCHEMA.sql
│   ├── GETTING_STARTED.md
│   └── CONTRIBUTING.md
└── README.md
```

---

## Component Responsibilities

### Backend (Spring Boot)

| Package | Responsibility |
|---------|---------------|
| `config` | Spring Security, CORS, app configuration |
| `security` | JWT token generation, validation, authentication filter, SecurityContext |
| `common.exception` | Custom exceptions and global error handler with proper HTTP status codes |
| `auth` | User registration, login, JWT issuance |
| `wallet` | Wallet balance lookup |
| `blockchain` | SHA-256 hashing, block creation, chain verification |
| `transactions` | Token transfers with blockchain recording |
| `marketplace` | Item listing, browsing, purchasing with blockchain recording |
| `cardano` | Blockfrost API integration — Cardano network stats and transaction lookup |

### Frontend (React)

| Folder | Responsibility |
|--------|---------------|
| `pages` | Full page components (routed) |
| `components` | Reusable UI components (Navbar, ProtectedRoute) |
| `services` | Axios API client with JWT interceptor |
| `context` | React Context for auth state management |

---

## Key Design Decisions

### 1. Blockchain Implementation

- **Hashing Algorithm:** SHA-256 (Java `MessageDigest`)
- **Chain Structure:** Linear chain where each block references `prev_hash`
- **Block Content Hash:** `SHA256(block_index + timestamp + sender_wallet + receiver_wallet + amount + type + prev_hash)`
- **Genesis Block:** Removed — first real transaction starts at block index 0
- **Verification:** Full chain walk, recompute every hash, compare to stored value
- **Concurrency:** Block creation is `synchronized` with `MAX(block_index) + 1` to prevent race conditions

### 2. Authentication Flow

```
Register → Hash password (BCrypt) → Save user → Auto-create wallet (100 MKT) → Return JWT
Login → Validate credentials → Return JWT
Every request → JwtAuthFilter validates JWT → Sets SecurityContextHolder
Controllers → Extract userId from SecurityContextHolder (no manual header parsing)
```

### 3. Error Handling

```
Custom Exceptions → GlobalExceptionHandler → Proper HTTP status codes + JSON
  NotFoundException      → 404 { "message": "..." }
  UnauthorizedException → 401 { "message": "..." }
  ForbiddenException    → 403 { "message": "..." }
  ConflictException     → 409 { "message": "..." }
  IllegalArgumentException → 400 { "message": "..." }
  RuntimeException      → 500 { "message": "..." }

Spring Security → AuthenticationEntryPoint / AccessDeniedHandler → JSON (no Whitelabel)
```

### 4. Transaction Flow (Transfer)

```
1. Validate sender and receiver exist and are different
2. Validate sender has sufficient balance
3. Debit sender wallet
4. Credit receiver wallet
5. Create Block with SHA-256 hash (synchronized)
6. Save block to database
7. Return updated balance and block hash
```

### 5. Transaction Flow (Purchase)

```
1. Validate item exists and is Available
2. Validate buyer is not the seller
3. Validate buyer has sufficient balance
4. Debit buyer wallet
5. Credit seller wallet
6. Update item status to "Sold"
7. Create Block with SHA-256 hash (synchronized)
8. Save block to database
9. Return confirmation with block hash
```

### 6. External API Integration (Blockfrost)

```
BlockfrostService → RestTemplate → Blockfrost REST API
  GET /network           → Network health, latest block, epoch, supply
  GET /blocks/latest     → Latest block details
  GET /epochs/latest     → Current epoch info
  GET /txs/{hash}        → Transaction lookup by hash
All endpoints are public (no auth required)
Graceful fallback if API is unavailable (health: false)
```

---

## Database ER Diagram

```
┌──────────────┐       ┌──────────────┐
│    users      │       │    wallets    │
├──────────────┤       ├──────────────┤
│ id (PK)      │──1:1──│ wallet_id(PK)│
│ username     │       │ user_id (FK) │
│ email        │       │ token_balance│
│ password_hash│       └──────────────┘
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐       ┌──────────────┐
│    items      │       │    blocks     │
├──────────────┤       ├──────────────┤
│ item_id (PK) │       │ block_id(PK) │
│ name         │       │ block_index  │
│ price        │       │ timestamp    │
│ seller_id(FK)│       │ sender_wallet│
│ status       │       │ receiver_wallet
└──────────────┘       │ amount       │
                       │ type         │
                       │ prev_hash    │
                       │ hash         │
                       └──────────────┘
```

---

## Technology Justification

| Technology | Why |
|-----------|-----|
| **Spring Boot** | Industry-standard Java framework, excellent JPA/ORM support, easy REST APIs |
| **ReactJS** | Lightweight, component-based, fast development with hooks |
| **PostgreSQL** | ACID-compliant relational DB, free on Supabase, supports complex queries |
| **JWT** | Stateless authentication, no session storage needed, works with REST |
| **SHA-256** | Standard cryptographic hash, native in Java, deterministic and collision-resistant |
| **Supabase** | Free PostgreSQL hosting with dashboard, no local setup needed for team |
| **Blockfrost** | Free Cardano blockchain API, REST-based, well-documented, no complex auth |
