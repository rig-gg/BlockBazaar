# BlockBazaar - Sprint Plan (3 Members, 5 Days)

## Team Assignments

| Member | Role | Primary Focus |
|--------|------|---------------|
| **Gyle M. Amihan** | Backend (Solo) | All Spring Boot code: auth, blockchain, wallet, transactions, marketplace, Blockfrost integration, DB schema, error handling |
| **Karl Andrei B. Abriz** | Frontend | React pages, components, styling, API integration |
| **Kirsten Shane Baldon** | Frontend | React pages, components, styling, API integration |

> **Note:** Gyle owns all backend. Karl and Kirsten split frontend work between them. Coordinate on API contracts before Day 1 ends. Gyle shares the API reference doc so frontend can stub pages with mock data early.

---

## Day-by-Day Breakdown

### Day 1 — Setup & Authentication

| Task | Assigned To | Status |
|------|-------------|--------|
| Create Spring Boot project (`spring-init` or Spring Initializr) | Gyle | [x] |
| Set up Supabase PostgreSQL project, share credentials | Gyle | [x] |
| Write and run `schema.sql` (all 4 tables) | Gyle | [x] |
| Configure `application.properties` (DB URL, JPA, JWT secret) | Gyle | [x] |
| Implement `User` and `Wallet` JPA models | Gyle | [x] |
| Implement `UserRepository` and `WalletRepository` | Gyle | [x] |
| Implement `AuthController` + `AuthService` (register + login) | Gyle | [x] |
| Implement `JwtUtil` and `JwtAuthFilter` | Gyle | [x] |
| Implement `SecurityConfig` (Spring Security + JWT filter) | Gyle | [x] |
| Create React project (`npx create-react-app frontend`) | Karl | [x] |
| Build React login page | Karl | [x] |
| Build React register page | Karl | [x] |
| Set up `AuthContext` for JWT token storage | Kirsten | [x] |
| Set up Axios API service with base URL | Kirsten | [x] |
| Set up `ProtectedRoute` component | Kirsten | [x] |
| Create `.env.example` with all required variables | Gyle | [x] |
| Set up Git branching strategy (main + feature branches) | Gyle | [x] |

**Day 1 Deliverable:** Users can register and log in. JWT is returned and stored in frontend. Database has `users` and `wallets` tables.

---

### Day 2 — Blockchain Core & Wallet

| Task | Assigned To | Status |
|------|-------------|--------|
| Implement `Block` JPA model | Gyle | [x] |
| Implement `BlockRepository` | Gyle | [x] |
| Implement `BlockchainService` (hash computation, chain walk) | Gyle | [x] |
| Implement `ChainController` (`GET /api/chain/verify`) | Gyle | [x] |
| Implement `WalletController` (`GET /api/wallet`) | Gyle | [x] |
| Implement `WalletService` (balance check, wallet lookup) | Gyle | [x] |
| Wire auth: extract user from JWT in all endpoints | Gyle | [x] |
| Build Dashboard page (show balance, quick actions) | Karl | [x] |
| Build Navbar component with navigation links | Karl | [x] |
| Build Chain Verification page (call `/api/chain/verify`, display result) | Kirsten | [x] |
| Test auth + wallet endpoints with Postman/curl | Gyle | [x] |

**Day 2 Deliverable:** Blockchain hashing and verification works. Users can see their wallet balance. Chain verify returns integrity status.

---

### Day 3 — Token Transfers

| Task | Assigned To | Status |
|------|-------------|--------|
| Implement `TransferRequest` DTO | Gyle | [x] |
| Implement `TransactionService` (transfer logic: debit, credit, create block) | Gyle | [x] |
| Implement `TransactionController` (`POST /api/transactions/transfer`, `GET /api/transactions`) | Gyle | [x] |
| Add balance validation (reject if insufficient funds) | Gyle | [x] |
| Ensure every transfer creates a new Block with proper hash chaining | Gyle | [x] |
| Wire `BlockchainService` into `TransactionService` | Gyle | [x] |
| Build Transfer page (form: recipient username, amount) | Karl | [x] |
| Build Transaction History page (table of past transactions) | Kirsten | [x] |
| Add wallet balance display to Navbar or Dashboard | Karl | [x] |
| Test full transfer flow end-to-end (2 users, transfer, verify chain) | All | [x] |

**Day 3 Deliverable:** Users can transfer tokens. Every transfer is recorded as a block. Transaction history is visible. Chain verify detects any tampering.

---

### Day 4 — Marketplace

| Task | Assigned To | Status |
|------|-------------|--------|
| Implement `Item` JPA model | Gyle | [x] |
| Implement `ItemRepository` | Gyle | [x] |
| Implement `MarketplaceService` (list, browse, buy) | Gyle | [x] |
| Implement `MarketplaceController` (GET items, POST list, POST buy) | Gyle | [x] |
| Integrate purchase flow with `BlockchainService` (create block on purchase) | Gyle | [x] |
| Handle sold-out items (status = "Sold", prevent double-buy) | Gyle | [x] |
| Build Marketplace browse page (grid/list of items) | Karl | [x] |
| Build List Item form (name, price) | Kirsten | [x] |
| Build Buy confirmation flow | Kirsten | [x] |
| Add "My Listings" section for sellers | Karl | [x] |
| Test marketplace flow end-to-end | All | [x] |

**Day 4 Deliverable:** Full marketplace works. Users can list, browse, and buy items. Purchases are recorded on the blockchain.

---

### Day 5 — Integration, Polish & External API

| Task | Assigned To | Status |
|------|-------------|--------|
| Integrate Blockfrost API (Cardano mainnet stats + tx lookup) | Gyle | [x] |
| Add `/api/cardano/network` and `/api/cardano/tx/{hash}` endpoints | Gyle | [x] |
| Fix error handling: custom exceptions with proper HTTP status codes | Gyle | [x] |
| Fix SecurityConfig: JSON error responses instead of Whitelabel | Gyle | [x] |
| Fix N+1 query in transaction history with JPQL JOIN | Gyle | [x] |
| Fix genesis block placeholder hash issue | Gyle | [x] |
| Fix block index race condition with MAX()+1 and synchronized | Gyle | [x] |
| Move controllers to use SecurityContextHolder instead of manual JWT extraction | Gyle | [x] |
| Final end-to-end testing of all flows | Gyle | [x] |
| Verify chain tamper-detection works (manually alter a block, re-verify) | Gyle | [x] |
| UI cleanup, loading states, error messages | Karl | [x] |
| Responsive design pass (mobile-friendly) | Kirsten | [x] |
| Update README.md with final documentation | All | [x] |
| Demo preparation (talking points, test data) | All | [x] |
| Bug fixes and final polish | All | [x] |

**Day 5 Deliverable:** Complete, polished application ready for demo and submission.

---

## Git Branching Strategy

```
main (protected)
├── feature/backend-amihan    (Gyle)
├── feature/frontend-karl     (Karl)
└── feature/frontend-kirsten  (Kirsten)
```

### Rules
- Never push directly to `main`
- Create a feature branch from `main`
- Open a PR (or request review) before merging
- Delete feature branch after merge
- Pull `main` daily to stay in sync

---

## API Contract (Agree Before Coding)

Gyle publishes this contract. Karl and Kirsten stub frontend pages using these shapes before backend is live.

### POST /api/auth/register
```json
// Request
{ "username": "string", "email": "string", "password": "string" }
// Response (201)
{ "token": "jwt-string", "userId": 1, "username": "string" }
```

### POST /api/auth/login
```json
// Request
{ "loginIdentifier": "string", "password": "string" }
// Response (200)
{ "token": "jwt-string", "userId": 1, "username": "string" }
```

### GET /api/wallet
```json
// Headers: Authorization: Bearer <jwt>
// Response (200)
{ "walletId": 1, "userId": 1, "balance": 100.00 }
```

### POST /api/transactions/transfer
```json
// Request
{ "receiverUsername": "string", "amount": 50.00 }
// Response (200)
{ "message": "Transfer successful", "blockHash": "sha256...", "newBalance": 50.00 }
```

### GET /api/transactions
```json
// Response (200)
{
  "transactions": [
    {
      "blockIndex": 1,
      "timestamp": "2025-07-18T12:00:00",
      "sender": "alice",
      "receiver": "bob",
      "amount": 50.00,
      "type": "Transfer",
      "hash": "sha256..."
    }
  ]
}
```

### GET /api/chain/verify
```json
// Response (200)
{
  "valid": true,
  "totalBlocks": 5,
  "message": "Chain is valid. All 5 blocks verified."
}
```

### GET /api/marketplace/items
```json
// Response (200)
{
  "items": [
    {
      "itemId": 1,
      "name": "Digital Art #1",
      "price": 25.00,
      "seller": "alice",
      "status": "Available",
      "createdAt": "2025-07-18T12:00:00"
    }
  ]
}
```

### POST /api/marketplace/items
```json
// Request
{ "name": "Digital Art #1", "price": 25.00 }
// Response (201)
{ "itemId": 1, "name": "Digital Art #1", "price": 25.00, "message": "Item listed successfully" }
```

### POST /api/marketplace/items/{id}/buy
```json
// Response (200)
{ "message": "Purchase successful", "itemId": 1, "itemName": "Digital Art #1", "blockHash": "sha256...", "newBalance": 50.00 }
```

### GET /api/cardano/network
```json
// Response (200)
{
  "network": "cardano-mainnet",
  "latestBlock": { "hash": "...", "height": 10482931, "slot": 12345678, "epoch": 523, "time": "..." },
  "supply": { "total": "45000000000", "circulating": "37500000000" },
  "health": true
}
```

### GET /api/cardano/tx/{hash}
```json
// Response (200)
{
  "hash": "abc123...",
  "block": 10482931,
  "blockHeight": 10482931,
  "index": 0,
  "inputSum": "1500000",
  "outputSum": "1497500",
  "fee": "2500",
  "inputCount": 1,
  "outputCount": 2
}
```

---

## Error Response Format

All errors follow this structure:
```json
{ "message": "Description of what went wrong" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request (validation errors, insufficient balance) |
| 401 | Unauthorized (missing/invalid JWT) |
| 403 | Forbidden (authenticated but not allowed) |
| 404 | Not Found (user, wallet, item, transaction) |
| 409 | Conflict (duplicate email/username) |
| 500 | Internal Server Error (unexpected failures) |

---

## Communication Protocol

- **Daily standup:** 10 min at start of session — what did you do, what will you do, any blockers
- **Blockers:** Message group chat immediately, don't spin for more than 15 min
- **PR reviews:** At least one other member must review before merge
- **API changes:** Gyle notifies team in group chat before changing any endpoint contract
