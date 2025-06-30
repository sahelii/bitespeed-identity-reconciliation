# Bitespeed Identity Reconciliation API

This is a Node.js backend service built with TypeScript, Express, Prisma, and PostgreSQL that solves the **Identity Reconciliation** problem for Bitespeed and FluxKart.

Dr. Emmett Brown is making mysterious purchases under different emails and phone numbers. This backend links all those identities back to a single customer, no matter how many aliases they use!

---

## 🚀 Live API Endpoint

**POST /identify:**  
👉 https://bitespeed-identity-reconciliation-production.up.railway.app/identify  
**GET /health:**  
👉 https://bitespeed-identity-reconciliation-production.up.railway.app/health

---

## 📦 Tech Stack

- Node.js + TypeScript
- Express.js
- Prisma ORM + PostgreSQL
- Docker + Docker Compose
- Railway (Hosting)
- Jest (Unit & Integration Testing)

---

## 🧠 Problem Overview

FluxKart users often make purchases with different emails/phone numbers.  
This backend links different contact details to a single user using a relational schema:

```ts
Contact {
  id             Int
  phoneNumber    String?
  email          String?
  linkedId       Int? // ID of another Contact linked to this one
  linkPrecedence "primary" | "secondary"
  createdAt      DateTime
  updatedAt      DateTime
  deletedAt      DateTime?
}
```

---

## 📫 API Endpoints

### POST `/identify`

Link or create contact identities based on provided email and/or phoneNumber.

#### 📥 Request Payload

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "9876543210"
}
```

#### 📤 Response

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["9876543210"],
    "secondaryContactIds": [23]
  }
}
```

---

### GET `/health`

Returns a basic health check to confirm the server is up.

```json
{
  "status": "ok"
}
```

---

## 🧪 Local Development & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sahelii/bitespeed-identity-reconciliation.git
cd bitespeed-identity-reconciliation
```

### 2. Setup `.env` file

```env
DATABASE_URL="your_postgres_url"
PORT=3000
```

### 3. Run locally

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 4. Run tests

```bash
npm run test
```

---

## 🧠 Logic Rules (As per Bitespeed Task)

- New contact → `linkPrecedence: primary`
- Same email/phone found → consolidate to oldest record
- If two primaries match on different fields → older becomes primary, newer turns into `secondary`
- Circular chains are avoided using `linkedId` and history is preserved via timestamps

---

## 🧪 Test Payloads from Assignment

| Input Email               | Input Phone | Output Primary ID | Secondary IDs |
|--------------------------|-------------|--------------------|----------------|
| `lorraine@hillvalley.edu`| `9876543210`    | `1`                | `[]`           |
| `mcfly@hillvalley.edu`   | `9876543210`    | `1`                | `[23]`         |
| `biffsucks@hillvalley.edu` | `8787879856`  | `11`               | `[27]`         |
| `george@hillvalley.edu`  | `8787879856`    | `11`               | `[27]`         |

---

## 📦 Deployment Info

- Hosted on: [Railway.app](https://railway.app/)
- DB used: PostgreSQL (Cloud)
- Prisma schema is bundled & migrations pushed
- Fully dockerized app: `docker-compose up -d`

---

## 📬 Submission Info

- 🔗 GitHub: [https://github.com/sahelii/bitespeed-identity-reconciliation]
- 🌐 Hosted API: https://bitespeed-identity-reconciliation-production.up.railway.app/identify
- 🧠 Challenge solved with all edge cases handled
- ✅ Tests passing for all scenarios

---

## 👩‍💻 Author

**Saheli Mahapatra**  
[LinkedIn](https://www.linkedin.com/in/saheli-mahapatra-83b759202/) • [GitHub](https://github.com/sahelii)

---

## 📜 License

This project is for educational purposes and interview evaluation.
