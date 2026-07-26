# BlockBazaar - Getting Started

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Java | 17+ | Backend runtime |
| Maven | 3.8+ | Backend build tool (or use included `mvnw`) |
| Node.js | 18+ | Frontend runtime |
| npm | 9+ | Frontend package manager |
| Git | Latest | Version control |
| Supabase account | Free tier | PostgreSQL hosting |
| Blockfrost account | Free tier | Cardano blockchain API |

---

## 1. Clone the Repository

```bash
git clone https://github.com/rig-gg/BlockBazaar.git
cd BlockBazaar
```

---

## 2. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **anon/public key**
3. Go to SQL Editor in Supabase dashboard
4. Run the contents of `docs/DATABASE_SCHEMA.sql`
5. Copy your connection string from Settings → Database → Connection string → URI

Your `DB_URL` will look like:
```
jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

---

## 3. Blockfrost Setup (Cardano API)

1. Go to [blockfrost.io](https://blockfrost.io) and create an account
2. Create a new project (select **Cardano Mainnet**)
3. Copy your **project_id** — this is your API key

---

## 4. Backend Setup

```bash
cd backend
```

### Configure Environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `backend/.env` with your actual credentials:

```properties
# Database (Supabase)
DB_URL=jdbc:postgresql://your-host:5432/postgres
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your-super-secret-key-at-least-32-chars
JWT_EXPIRATION=86400000

# Blockfrost (Cardano Mainnet)
BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
BLOCKFROST_API_URL=https://cardano-mainnet.blockfrost.io/api/v0
```

### Build and Run

```bash
# Using Maven wrapper (recommended — no Maven install needed)
./mvnw spring-boot:run

# Or using system Maven
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

---

## 5. Frontend Setup

```bash
cd ../frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env` in the `frontend/` folder:

```
REACT_APP_API_URL=http://localhost:8080/api
```

### Run

```bash
npm start
```

Frontend runs at `http://localhost:3000`

---

## 6. Verify Everything Works

1. Open `http://localhost:3000`
2. Register a new user (e.g., "alice")
3. Register a second user in incognito tab (e.g., "bob")
4. Transfer tokens from alice to bob
5. Bob lists an item for sale
6. Alice buys the item
7. Visit the Chain Verify page — all blocks should show as valid
8. Check the Dashboard for Cardano network stats (Blockfrost integration)

---

## Quick Test with curl

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"loginIdentifier":"alice@test.com","password":"pass123"}'

# Use the token from login response
TOKEN="your-jwt-token-here"

# Get wallet balance
curl http://localhost:8080/api/wallet \
  -H "Authorization: Bearer $TOKEN"

# Transfer tokens
curl -X POST http://localhost:8080/api/transactions/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiverUsername":"bob","amount":25}'

# Verify chain
curl http://localhost:8080/api/chain/verify

# Cardano network stats (no auth needed)
curl http://localhost:8080/api/cardano/network

# Look up a Cardano transaction (no auth needed)
curl http://localhost:8080/api/cardano/tx/f1c24763f4ddca8a8b0dcc91ea76a1a9657cfe1615c72a459f5f370069a28874
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Connection refused` on DB | Check `DB_URL`, ensure Supabase project is active |
| `JWT signature invalid` | Ensure `JWT_SECRET` is consistent, check token expiration |
| Frontend can't reach API | Verify `REACT_APP_API_URL` in `.env`, check CORS config |
| `401 Unauthorized` on endpoints | Ensure JWT is attached in `Authorization: Bearer <token>` header |
| `403 Forbidden` on endpoints | Token may be expired — log in again |
| Port 8080 already in use | Change `server.port` in `application.properties` |
| Port 3000 already in use | React will auto-prompt to use another port |
| Cardano API returns `health: false` | Check `BLOCKFROST_PROJECT_ID` is valid, API may be temporarily down |
| `release version 21 not supported` | Ensure you're using Java 17+ (check with `java -version`) |
