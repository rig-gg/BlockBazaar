# BlockBazaar - API Reference

Base URL: `http://localhost:8080`

All protected endpoints require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user. Automatically creates a wallet with 100 MKT tokens.

**Request:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "securepass123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "username": "alice"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Username or email already exists |
| 400 | Missing required fields |

---

### POST /api/auth/login

Authenticate and receive a JWT token.

**Request:**
```json
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "username": "alice"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 401 | Invalid email or password |

---

## Wallet Endpoints

### GET /api/wallet

Get the authenticated user's wallet balance.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "walletId": 1,
  "userId": 1,
  "balance": 100.00
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 401 | Unauthorized (missing/invalid token) |
| 404 | Wallet not found |

---

## Transaction Endpoints

### POST /api/transactions/transfer

Transfer MKT tokens to another user.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "receiverUsername": "bob",
  "amount": 25.00
}
```

**Response (200 OK):**
```json
{
  "message": "Transfer successful",
  "blockHash": "a3f2b8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
  "newBalance": 75.00
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Insufficient balance |
| 400 | Cannot transfer to yourself |
| 404 | Receiver not found |
| 400 | Invalid amount (must be > 0) |

---

### GET /api/transactions

Get the authenticated user's transaction history.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "blockIndex": 1,
      "timestamp": "2025-07-18T14:30:00",
      "sender": "alice",
      "receiver": "bob",
      "amount": 25.00,
      "type": "Transfer",
      "hash": "a3f2b8c9..."
    },
    {
      "blockIndex": 2,
      "timestamp": "2025-07-18T15:00:00",
      "sender": "charlie",
      "receiver": "alice",
      "amount": 10.00,
      "type": "Purchase",
      "hash": "b4c3d2e1..."
    }
  ]
}
```

---

## Blockchain Endpoints

### GET /api/chain/verify

Recompute and verify the entire blockchain. No authentication required (for demo purposes).

**Response (200 OK) — Valid Chain:**
```json
{
  "valid": true,
  "totalBlocks": 5,
  "message": "Chain is valid. All 5 blocks verified."
}
```

**Response (200 OK) — Tampered Chain:**
```json
{
  "valid": false,
  "totalBlocks": 5,
  "tamperedAt": 3,
  "message": "Chain integrity compromised. Block at index 3 has been tampered with."
}
```

---

## Marketplace Endpoints

### GET /api/marketplace/items

Browse all available marketplace listings.

**Response (200 OK):**
```json
{
  "items": [
    {
      "itemId": 1,
      "name": "Digital Art #1",
      "price": 25.00,
      "seller": "alice",
      "status": "Available"
    },
    {
      "itemId": 2,
      "name": "Premium Skin",
      "price": 50.00,
      "seller": "bob",
      "status": "Available"
    }
  ]
}
```

---

### POST /api/marketplace/items

List a new item for sale.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Digital Art #1",
  "price": 25.00
}
```

**Response (201 Created):**
```json
{
  "itemId": 1,
  "name": "Digital Art #1",
  "price": 25.00,
  "message": "Item listed successfully"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Price must be greater than 0 |

---

### POST /api/marketplace/items/{id}/buy

Purchase an item using MKT tokens.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Purchase successful",
  "itemId": 1,
  "itemName": "Digital Art #1",
  "blockHash": "c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4",
  "newBalance": 50.00
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Insufficient balance |
| 400 | Item already sold |
| 400 | Cannot buy your own item |
| 404 | Item not found |

---

## Common Error Format

All errors follow this structure:
```json
{
  "error": "Description of what went wrong"
}
```

---

## Authentication Flow

```
1. Register or Login → receive JWT token
2. Store token in localStorage (frontend)
3. Attach to every request: Authorization: Bearer <token>
4. Backend JwtAuthFilter validates token on every request
5. If invalid → 401 Unauthorized
6. If valid → request proceeds, user ID extracted from token
```
