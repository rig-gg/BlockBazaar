# BlockBazaar - Getting Started

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Java | 17+ | Backend runtime |
| Maven | 3.8+ | Backend build tool |
| Node.js | 18+ | Frontend runtime |
| npm | 9+ | Frontend package manager |
| Git | Latest | Version control |
| Supabase account | Free tier | PostgreSQL hosting |

---

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/BlockBazaar.git
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
postgresql://postgres.xxxxxx:your-password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 3. Backend Setup

```bash
cd backend
```

### Configure Environment

Create `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://your-supabase-host:6543/postgres
spring.datasource.username=postgres.your-project-ref
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-super-secret-key-at-least-32-chars
jwt.expiration=86400000

# Server
server.port=8080
```

### Build and Run

```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or using system Maven
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

---

## 4. Frontend Setup

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env` in the `frontend/` folder:

```
REACT_APP_API_URL=http://localhost:8080
```

### Run

```bash
npm start
```

Frontend runs at `http://localhost:3000`

---

## 5. Verify Everything Works

1. Open `http://localhost:3000`
2. Register a new user (e.g., "alice")
3. Register a second user in incognito tab (e.g., "bob")
4. Transfer tokens from alice to bob
5. Bob lists an item for sale
6. Alice buys the item
7. Visit the Chain Verify page — all blocks should show as valid

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
  -d '{"email":"alice@test.com","password":"pass123"}'

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
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Connection refused` on DB | Check `DB_URL`, ensure Supabase project is active |
| `JWT signature invalid` | Ensure `jwt.secret` is consistent, check token expiration |
| Frontend can't reach API | Verify `REACT_APP_API_URL` in `.env`, check CORS config |
| `403 Forbidden` on endpoints | Ensure JWT is attached in `Authorization: Bearer <token>` header |
| Port 8080 already in use | Change `server.port` in `application.properties` |
| Port 3000 already in use | React will auto-prompt to use another port |
