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
│  │  AuthController │ WalletController │ TransactionController│   │
│  │                 │ MarketplaceController│ ChainController  │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                     Services Layer                        │   │
│  │  AuthService │ WalletService │ TransactionService         │   │
│  │              │ MarketplaceService │ BlockchainService      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                  Repository Layer (JPA)                   │   │
│  │  UserRepository │ WalletRepository │ ItemRepository       │   │
│  │                 │ BlockRepository                         │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ JDBC/JPA
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL (Supabase)                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │ users  │ │wallets │ │ items  │ │ blocks │ ← blockchain ledger│
│  └────────┘ └────────┘ └────────┘ └────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
BlockBazaar/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/blockbazaar/
│   │       │   ├── BlockBazaarApplication.java
│   │       │   ├── config/
│   │       │   │   ├── CorsConfig.java
│   │       │   │   └── SecurityConfig.java
│   │       │   ├── controller/
│   │       │   │   ├── AuthController.java
│   │       │   │   ├── WalletController.java
│   │       │   │   ├── TransactionController.java
│   │       │   │   ├── MarketplaceController.java
│   │       │   │   └── ChainController.java
│   │       │   ├── dto/
│   │       │   │   ├── RegisterRequest.java
│   │       │   │   ├── LoginRequest.java
│   │       │   │   ├── TransferRequest.java
│   │       │   │   ├── ListItemRequest.java
│   │       │   │   └── AuthResponse.java
│   │       │   ├── model/
│   │       │   │   ├── User.java
│   │       │   │   ├── Wallet.java
│   │       │   │   ├── Item.java
│   │       │   │   └── Block.java
│   │       │   ├── repository/
│   │       │   │   ├── UserRepository.java
│   │       │   │   ├── WalletRepository.java
│   │       │   │   ├── ItemRepository.java
│   │       │   │   └── BlockRepository.java
│   │       │   ├── service/
│   │       │   │   ├── AuthService.java
│   │       │   │   ├── WalletService.java
│   │       │   │   ├── TransactionService.java
│   │       │   │   ├── MarketplaceService.java
│   │       │   │   └── BlockchainService.java
│   │       │   └── security/
│   │       │       ├── JwtUtil.java
│   │       │       └── JwtAuthFilter.java
│   │       └── resources/
│   │           ├── application.properties
│   │           └── schema.sql
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── WalletBalance.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transfer.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── TransactionHistory.jsx
│   │   │   └── ChainVerify.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── docs/
│   ├── PROJECT_ARCHITECTURE.md
│   ├── SPRINT_PLAN.md
│   ├── API_REFERENCE.md
│   ├── DATABASE_SCHEMA.sql
│   ├── GETTING_STARTED.md
│   └── CONTRIBUTING.md
├── .env.example
└── README.md
```

---

## Component Responsibilities

### Backend (Spring Boot)

| Package | Responsibility |
|---------|---------------|
| `controller` | REST endpoints, request validation, HTTP response mapping |
| `dto` | Request/response data transfer objects |
| `model` | JPA entities mapping to database tables |
| `repository` | Data access layer (Spring Data JPA) |
| `service` | Business logic, transaction management, hashing |
| `security` | JWT token generation, validation, authentication filter |
| `config` | CORS, Spring Security, and app configuration |

### Frontend (React)

| Folder | Responsibility |
|--------|---------------|
| `pages` | Full page components (routed) |
| `components` | Reusable UI components |
| `services` | Axios API client and request helpers |
| `context` | React Context for auth state management |

---

## Key Design Decisions

### 1. Blockchain Implementation

- **Hashing Algorithm:** SHA-256 (Java `MessageDigest`)
- **Chain Structure:** Linear chain where each block references `prev_hash`
- **Block Content Hash:** `SHA256(block_index + timestamp + sender_wallet + receiver_wallet + amount + type + prev_hash)`
- **Genesis Block:** First block has `prev_hash = "0".repeat(64)`
- **Verification:** Full chain walk, recompute every hash, compare to stored value

### 2. Authentication Flow

```
Register → Hash password (BCrypt) → Save user → Auto-create wallet → Return JWT
Login → Validate credentials → Return JWT
Every request → JwtAuthFilter extracts JWT → Validates → Sets SecurityContext
```

### 3. Transaction Flow (Transfer)

```
1. Validate sender has sufficient balance
2. Debit sender wallet
3. Credit receiver wallet
4. Create Block with SHA-256 hash
5. Save block to database
6. Return updated balances
```

### 4. Transaction Flow (Purchase)

```
1. Validate item exists and is Available
2. Validate buyer has sufficient balance
3. Debit buyer wallet
4. Credit seller wallet
5. Update item status to "Sold"
6. Create Block with SHA-256 hash
7. Save block to database
8. Return confirmation
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
