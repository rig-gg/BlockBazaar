# BlockBazaar - Sprint Plan (3 Members, 5 Days)

## Team Assignments

| Member | Role | Primary Focus |
|--------|------|---------------|
| **Gyle M. Amihan** | Backend Lead | Blockchain core, hashing logic, chain verification, DB schema |
| **Karl Andrei B. Abriz** | Full-stack | Auth system, wallet endpoints, transaction logic, Spring Boot config |
| **Kirsten Shane Baldon** | Frontend Lead | React app, all UI pages, API integration, styling |

> **Note:** Everyone touches the README/docs. Backend members coordinate on API contracts before coding. Frontend member stubs pages with mock data early, then integrates once backend endpoints are live.

---

## Day-by-Day Breakdown

### Day 1 — Setup & Authentication

| Task | Assigned To | Status |
|------|-------------|--------|
| Create Spring Boot project (`spring-init` or Spring Initializr) | Karl | ☐ |
| Create React project (`npx create-react-app frontend`) | Kirsten | ☐ |
| Set up Supabase PostgreSQL project, share credentials | Gyle | ☐ |
| Write `schema.sql` (all 4 tables) | Gyle | ☐ |
| Configure `application.properties` (DB URL, JPA, JWT secret) | Karl | ☐ |
| Implement `User` and `Wallet` JPA models | Karl | ☐ |
| Implement `UserRepository` and `WalletRepository` | Karl | ☐ |
| Implement `AuthController` + `AuthService` (register + login) | Karl | ☐ |
| Implement `JwtUtil` and `JwtAuthFilter` | Karl | ☐ |
| Implement `SecurityConfig` (Spring Security + JWT filter) | Karl | ☐ |
| Build React login and register pages | Kirsten | ☐ |
| Set up `AuthContext` for JWT token storage | Kirsten | ☐ |
| Set up Axios API service with base URL | Kirsten | ☐ |
| Set up `ProtectedRoute` component | Kirsten | ☐ |
| Create `.env.example` with all required variables | Gyle | ☐ |
| Set up Git branching strategy (main + feature branches) | Gyle | ☐ |

**Day 1 Deliverable:** Users can register and log in. JWT is returned and stored in frontend. Database has `users` and `wallets` tables.

---

### Day 2 — Blockchain Core & Wallet

| Task | Assigned To | Status |
|------|-------------|--------|
| Implement `Block` JPA model | Gyle | ☐ |
| Implement `BlockRepository` | Gyle | ☐ |
| Implement `BlockchainService` (hash computation, genesis block, chain walk) | Gyle | ☐ |
| Implement `ChainController` (`GET /api/chain/verify`) | Gyle | ☐ |
| Write SHA-256 hashing utility + unit test | Gyle | ☐ |
| Implement `WalletController` (`GET /api/wallet`) | Karl | ☐ |
| Implement `WalletService` (balance check, wallet lookup) | Karl | ☐ |
| Wire auth: extract user from JWT in all endpoints | Karl | ☐ |
| Build Dashboard page (show balance, quick actions) | Kirsten | ☐ |
| Build Navbar component with navigation links | Kirsten | ☐ |
| Build Chain Verification page (call `/api/chain/verify`, display result) | Kirsten | ☐ |
| Test chain verify endpoint with Postman/curl | Gyle | ☐ |

**Day 2 Deliverable:** Blockchain hashing and verification works. Users can see their wallet balance. Chain verify returns integrity status.

---

### Day 3 — Token Transfers

| Task | Assigned To | Status |
|------|-------------|--------|
| Implement `TransferRequest` DTO | Karl | ☐ |
| Implement `TransactionService` (transfer logic: debit, credit, create block) | Karl | ☐ |
| Implement `TransactionController` (`POST /api/transactions/transfer`, `GET /api/transactions`) | Karl | ☐ |
| Add balance validation (reject if insufficient funds) | Karl | ☐ |
| Ensure every transfer creates a new Block with proper hash chaining | Gyle | ☐ |
| Wire `BlockchainService` into `TransactionService` | Gyle | ☐ |
| Build Transfer page (form: recipient username, amount) | Kirsten | ☐ |
| Build Transaction History page (table of past transactions) | Kirsten | ☐ |
| Add wallet balance display to Navbar or Dashboard | Kirsten | ☐ |
| Test full transfer flow end-to-end (2 users, transfer, verify chain) | All | ☐ |

**Day 3 Deliverable:** Users can transfer tokens. Every transfer is recorded as a block. Transaction history is visible. Chain verify detects any tampering.

---

### Day 4 — Marketplace

| Task | Assigned To | Status |
|------|-------------|--------|
| Implement `Item` JPA model | Gyle | ☐ |
| Implement `ItemRepository` | Gyle | ☐ |
| Implement `MarketplaceService` (list, browse, buy) | Gyle | ☐ |
| Implement `MarketplaceController` (GET items, POST list, POST buy) | Gyle | ☐ |
| Integrate purchase flow with `BlockchainService` (create block on purchase) | Gyle | ☐ |
| Handle sold-out items (status = "Sold", prevent double-buy) | Gyle | ☐ |
| Build Marketplace browse page (grid/list of items) | Kirsten | ☐ |
| Build List Item form (name, price) | Kirsten | ☐ |
| Build Buy confirmation flow | Kirsten | ☐ |
| Add "My Listings" section for sellers | Kirsten | ☐ |
| Test marketplace flow end-to-end | All | ☐ |

**Day 4 Deliverable:** Full marketplace works. Users can list, browse, and buy items. Purchases are recorded on the blockchain.

---

### Day 5 — Integration, Polish & External API

| Task | Assigned To | Status |
|------|-------------|--------|
| Integrate instructor-assigned external API (TBD) | Karl | ☐ |
| Add external API data to Dashboard or transaction flow | Karl | ☐ |
| Final end-to-end testing of all flows | Gyle | ☐ |
| Verify chain tamper-detection works (manually alter a block, re-verify) | Gyle | ☐ |
| UI cleanup, loading states, error messages | Kirsten | ☐ |
| Responsive design pass (mobile-friendly) | Kirsten | ☐ |
| Update README.md with final documentation | All | ☐ |
| Demo preparation (talking points, test data) | All | ☐ |
| Bug fixes and final polish | All | ☐ |

**Day 5 Deliverable:** Complete, polished application ready for demo and submission.

---

## Git Branching Strategy

```
main (protected)
├── feature/auth          (Karl)
├── feature/blockchain    (Gyle)
├── feature/wallet        (Karl)
├── feature/transfers     (Karl)
├── feature/marketplace   (Gyle)
├── feature/frontend      (Kirsten)
└── feature/external-api  (Karl)
```

### Rules
- Never push directly to `main`
- Create a feature branch from `main`
- Open a PR (or request review) before merging
- Delete feature branch after merge
- Pull `main` daily to stay in sync

---

## API Contract (Agree Before Coding)

Backend members (Gyle + Karl) should agree on these request/response shapes before Day 1 ends:

### POST /api/auth/register
```json
// Request
{ "username": "string", "email": "string", "password": "string" }
// Response
{ "token": "jwt-string", "userId": 1, "username": "string" }
```

### POST /api/auth/login
```json
// Request
{ "email": "string", "password": "string" }
// Response
{ "token": "jwt-string", "userId": 1, "username": "string" }
```

### GET /api/wallet
```json
// Headers: Authorization: Bearer <jwt>
// Response
{ "walletId": 1, "balance": 100.00 }
```

### POST /api/transactions/transfer
```json
// Request
{ "receiverUsername": "string", "amount": 50.00 }
// Response
{ "message": "Transfer successful", "blockHash": "sha256...", "newBalance": 50.00 }
```

### GET /api/transactions
```json
// Response
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
// Response
{
  "valid": true,
  "totalBlocks": 5,
  "message": "Chain is valid. All 5 blocks verified."
}
```

### GET /api/marketplace/items
```json
// Response
{
  "items": [
    {
      "itemId": 1,
      "name": "Digital Art #1",
      "price": 25.00,
      "seller": "alice",
      "status": "Available"
    }
  ]
}
```

### POST /api/marketplace/items
```json
// Request
{ "name": "Digital Art #1", "price": 25.00 }
// Response
{ "itemId": 1, "message": "Item listed successfully" }
```

### POST /api/marketplace/items/{id}/buy
```json
// Response
{ "message": "Purchase successful", "blockHash": "sha256..." }
```

---

## Communication Protocol

- **Daily standup:** 10 min at start of session — what did you do, what will you do, any blockers
- **Blockers:** Message group chat immediately, don't spin for more than 15 min
- **PR reviews:** At least one other member must review before merge
- **API changes:** Must notify team in group chat before changing any endpoint contract
