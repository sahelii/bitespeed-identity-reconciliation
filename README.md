# Bitespeed Identity Reconciliation API

This project is a backend service to reconcile user identities based on phone numbers and email addresses. Given a new contact, it returns the associated primary and secondary contacts, ensuring no duplicate identities are stored.

## 🔧 Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Prisma ORM** with **PostgreSQL**
- **Docker & Docker Compose**
- **Jest** - Unit and integration testing

---

## 📦 Endpoints

### 🔹 `POST /identify`

**Description:**  
Accepts an email and/or phone number, checks existing records, and returns the unified contact structure.

**Request Body:**
```json
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
```

**Response Example:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["john@example.com", "john@bitespeed.com"],
    "phoneNumbers": ["1234567890", "9876543210"],
    "secondaryContactIds": [2, 3]
  }
}
```

---

### 🔹 `GET /health`

**Description:**  
Simple health check for monitoring container and app status.

**Response:**
```json
{
  "status": "ok"
}
```

---

## 🚀 Hosted API

👉 **Live Deployment:**  
[https://bitespeed-identity-reconciliation-production.up.railway.app](https://bitespeed-identity-reconciliation-production.up.railway.app)

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bitespeed-identity-reconciliation.git
cd bitespeed-identity-reconciliation
```

### 2. Configure environment variables

Create a `.env` file with the following:
```env
DATABASE_URL=your_postgres_connection_string
PORT=3000
NODE_ENV=development
```

### 3. Run with Docker

```bash
docker compose up -d
```

To rebuild after changes:
```bash
docker compose down -v --remove-orphans
docker compose up -d --build
```

---

## 🧪 Running Tests

Run the test suite inside the Docker container:
```bash
docker compose exec app npm test
```

---
