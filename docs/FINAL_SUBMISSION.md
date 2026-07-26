# BlockBazaar — Final Project Submission Documentation
## CSIT360 - Introduction to Blockchain

---

## Project Overview

**BlockBazaar** is a decentralized marketplace web application where users can register accounts, manage MKT token wallets, list/buy digital assets, transfer tokens peer-to-peer, and verify blockchain integrity. It also integrates the **Blockfrost Cardano API** to display live Cardano mainnet data.

**Tech Stack:**
- **Backend:** Java 17, Spring Boot 3.3.1, Spring Data JPA, PostgreSQL (Supabase), JWT Auth
- **Frontend:** React 18, React Router, Axios, CSS Glassmorphism Design System
- **Blockchain:** Blockfrost API (Cardano Mainnet), custom in-app blockchain with SHA-256 hashing
- **Deployment:** Supabase PostgreSQL (cloud-hosted)

**Team:**
- Gyle M. Amihan — Backend & Blockchain (solo)
- Karl Andrei B. Abriz — Frontend
- Kirsten Shane Baldon — Frontend

---

## What Was Built

### Backend Features (Gyle — Solo)
1. **Authentication System** — JWT-based register/login with BCrypt password hashing
2. **Wallet Management** — Each user gets an auto-created wallet with MKT token balance
3. **Token Transfers** — Peer-to-peer transfers with balance validation, recorded on-chain
4. **Marketplace** — List items for sale, buy items with MKT tokens, all transactions recorded in blocks
5. **Custom Blockchain** — SHA-256 proof-of-work chain with genesis block, block verification endpoint
6. **Chain Integrity Verification** — Audit endpoint that validates hash linkages across all blocks
7. **Blockfrost Cardano Integration** — Live network stats (block height, epoch, slot) and transaction lookup
8. **Global Exception Handling** — Custom exception hierarchy (401, 403, 404, 409) with JSON responses

### Frontend Features (Karl & Kirsten)
1. **Login / Register** — Form validation, JWT storage, redirect flow
2. **Dashboard** — Wallet balance, Cardano network stats, quick actions, recent activity
3. **Transfer Page** — Send MKT tokens with percentage shortcuts (25%, 50%, 75%, MAX)
4. **Marketplace** — Browse/search listings, buy flow with confirmation modal and on-chain proof
5. **My Listings** — Create new listings, view active items
6. **Transactions** — Full ledger table with copy-to-clipboard hashes
7. **Chain Verify** — Visual blockchain audit with block-by-block breakdown
8. **Cardano Explorer** — Real Cardano transaction lookup by hash
9. **Glassmorphism UI** — Dark theme, animated backgrounds, glass cards, responsive design

---

## Architecture

```
┌─────────────────┐     REST API      ┌──────────────────────┐
│  React Frontend │ ◄───────────────► │  Spring Boot Backend  │
│  (Port 3000)    │                    │  (Port 8080)          │
└─────────────────┘                    └──────────┬───────────┘
                                                  │
                                    ┌─────────────┼─────────────┐
                                    │             │             │
                              ┌─────▼─────┐ ┌────▼────┐ ┌─────▼──────┐
                              │ PostgreSQL │ │  SHA-256 │ │ Blockfrost │
                              │ (Supabase) │ │Blockchain│ │  (Cardano) │
                              └───────────┘ └─────────┘ └────────────┘
```

---

## Problems Encountered & How They Were Solved

### Problem 1: Java Version Mismatch
**What happened:** Backend was compiled with Java 21, but Gyle's machine only has Java 17. The app wouldn't start.
**Solution:** Changed `<java.version>` in `pom.xml` from 21 to 17. Verified all 43 source files compiled cleanly.

### Problem 2: Whitelabel Error Page (404/405)
**What happened:** When users hit a non-existent URL, they saw Spring's ugly "Whitelabel Error Page" with an HTML error instead of a proper JSON response. This broke the frontend error handling.
**Solution:** Added `spring.mvc.throw-exception-if-no-handler-found=true` and `spring.web.resources.add-mappings=false` to `application.properties`. Added `NoHandlerFoundException` and `HttpRequestMethodNotSupportedException` handlers to `GlobalExceptionHandler`. Also added SecurityConfig `authenticationEntryPoint` and `accessDeniedHandler` for JSON responses on auth errors.

### Problem 3: N+1 Query Performance Issue
**What happened:** The transactions endpoint was loading blocks one-by-one instead of joining. For 100 transactions, it made 100+ separate database queries.
**Solution:** Added a `@Query` JOIN in `BlockRepository` called `findTransactionsByWallet()`. Rewrote `TransactionService.getTransactions()` to use the single optimized query.

### Problem 4: Genesis Block Hash Placeholder
**What happened:** The `schema.sql` had a placeholder hash for the genesis block (`0x0000...`) that wasn't a valid SHA-256 hash. When the blockchain service tried to verify integrity, it would fail.
**Solution:** Removed the broken INSERT from `schema.sql` and `docs/DATABASE_SCHEMA.sql`. Let the `BlockchainService` create the genesis block dynamically at runtime with a proper computed hash.

### Problem 5: Block Index Race Condition
**What happened:** Multiple simultaneous transactions could get the same block index because `count()` was used to determine the next index. Two concurrent requests could both read count=5, then both try to create block 6.
**Solution:** Changed `getNextBlockIndex()` to use `findMaxBlockIndex() + 1` (database-level max), and made `createBlock()` `synchronized` to prevent concurrent block creation.

### Problem 6: SecurityContextHolder Not Used
**What happened:** Controllers were parsing the JWT token manually by reading the `Authorization` header and extracting the user ID. This duplicated logic across every controller and bypassed Spring Security's built-in context.
**Solution:** Refactored all controllers to use `JwtAuthFilter.extractUserId()` which reads from `SecurityContextHolder.getContext().getAuthentication()`. This is the standard Spring Security pattern.

### Problem 7: Blockfrost ClassCastException (THE HARDEST BUG)
**What happened:** The Cardano network endpoint kept returning "Offline" on the frontend. The backend logged:
```
Failed to fetch Cardano network info: class java.lang.Integer cannot be cast to class java.lang.String
```
**Initial (wrong) diagnosis:** I initially thought the bug was in the `supply` field — Blockfrost's `/network` endpoint returns `supply` as a nested object, and the original code did `(String) networkResp.getBody().get("supply")`. I fixed that to use `instanceof Number` checks.

But the error **persisted even after the fix**. The backend was recompiled, restarted, and the same error appeared.

**Root cause:** The ACTUAL bug was on a completely different line — `BlockfrostService.java:64`:
```java
latest.setTime((String) block.get("time"));
```
The Blockfrost `/blocks/latest` endpoint returns the `time` field as a **Unix timestamp integer** (`1785048805`), NOT an ISO string. Jackson deserializes it as `Integer`. The `(String)` cast threw `ClassCastException`.

**Why it was so hard to find:** The error message `Integer cannot be cast to String` was generic. The `supply` field fix was correct but was a red herring — it was a different line entirely. The catch block at line 81 swallowed the real stack trace and only logged the message.

**Solution:** Changed to `String.valueOf(block.get("time"))` which safely converts any type to String. Also added `instanceof Number` checks on the `supply` field as a defensive measure.

**Lesson learned:** Always log the full stack trace (`log.error("msg", e)` not just `e.getMessage()`), and read the Blockfrost API docs for EVERY endpoint's response schema, not just assumptions.

### Problem 8: Spring Boot Doesn't Read .env Files
**What happened:** The `BLOCKFROST_PROJECT_ID` was always empty at runtime even though `.env` had the value.
**Solution:** Added `me.paulschwarz:spring-dotenv:4.0.0` dependency to `pom.xml`. This library loads `.env` files into Spring properties automatically.

### Problem 9: Frontend Code Quality Issues
**What happened:** After the initial frontend was built, a code review revealed:
- `Icon` component was copy-pasted 7 times across pages
- `ICONS` object was duplicated 6 times
- No code splitting (all pages in one 110KB bundle)
- No error boundary (render crashes = white screen)
- No 401 auto-logout (expired JWTs showed confusing errors)
- Navbar injected a `<style>` tag on every render

**Solution (feature/frontend-cleanup branch):**
- Extracted `Icon` to `components/Icon.js` (used by 8 pages)
- Created shared `constants/icons.js` with 25 icon paths
- Created `PageLayout` wrapper component (eliminated boilerplate)
- Added `React.lazy` code splitting (main bundle dropped 31%)
- Added `ErrorBoundary` component
- Added 401 auto-logout in `api.js` interceptor
- Moved navbar styles to `index.css`
- Added Cardano hex hash validation

---

## Hardest Problem & How It Was Solved

The **Blockfrost ClassCastException** was by far the hardest problem. Here's why:

1. **Misdiagnosis:** I initially identified the wrong line (`supply` field) and fixed it. The code compiled and the fix was technically correct — but it wasn't the line causing the error.

2. **Persistence:** Even after recompiling and restarting, the same error appeared. I initially thought it was a stale class loading issue (old `.class` files still running). We killed processes, deleted `target/`, and recompiled from scratch. The error STILL appeared.

3. **The actual bug was hidden:** The error was on line 64 (`(String) block.get("time")`), but my eyes kept going to the `supply` section because that's where I'd already made changes. The Blockfrost API documentation for `/blocks/latest` showed `time` as a Unix integer, but I hadn't checked that endpoint's schema — I only looked at `/network`.

4. **Silent catch block:** The `catch (Exception e)` block only logged `e.getMessage()`, not the full stack trace. This made it impossible to know which exact line threw the exception without adding `e.printStackTrace()` or changing to `log.error("msg", e)`.

**How it was finally solved:** I re-read the entire `getNetworkInfo()` method line by line, checked the actual Blockfrost API response for `/blocks/latest`, and found that `time` is returned as `1785048805` (integer), not `"2024-01-01T00:00:00Z"` (string).

---

## Documentation & API Research

Yes, I went through the Blockfrost API documentation extensively:
- https://blockfrost.io/docs/api — for endpoint schemas, authentication, rate limits
- The API uses a `project_id` header for auth (not OAuth or API keys in URLs)
- Free tier has rate limits (10 requests/second, 500K requests/month)
- Responses use standard HTTP status codes (401 for invalid token, 404 for not found)

Going into a whole new API was initially overwhelming — Blockfrost has 100+ endpoints. But reading the docs carefully and testing with small requests first (just `/network`, then `/blocks/latest`) made it manageable. The key lesson was: **never assume an API response shape — always check the actual docs and test with real responses.**

---

## Git Branches & Workflow

| Branch | Purpose | Commits Ahead of Main |
|---|---|---|
| `main` | Production-ready code | — |
| `feature/backend` | Backend improvements + Blockfrost fix | 1 |
| `feature/frontend-cleanup` | Frontend refactor + backend fix | 2 |

**Total commits on main:** 40+ (across all merges and features)
**Files changed in backend improvements:** 27 files, +387/-115 lines
**Files changed in frontend cleanup:** 16 files, +1,407/-1,843 lines (net -436 = less code, more organized)

---

## Was My Contribution Satisfactory?

**What I delivered (as backend solo):**
- Complete Spring Boot backend with 5 REST API domains (auth, wallet, transactions, marketplace, chain)
- Custom blockchain implementation with SHA-256 hashing and integrity verification
- JWT authentication with role-based security
- Blockfrost Cardano API integration (network stats + transaction lookup)
- Fixed 9 critical/medium bugs including the hardest one (ClassCastException)
- Refactored frontend code quality issues (DRY, code splitting, error handling)
- Comprehensive documentation (README, API reference, architecture, sprint plan)

**What I learned:**
- Spring Security and JWT implementation from scratch
- How blockchain hashing actually works (not just theory)
- Reading and integrating third-party APIs (Blockfrost)
- Debugging production-level issues (race conditions, N+1 queries, ClassCastExceptions)
- Git workflow with feature branches, cherry-picks, and merge conflict resolution
