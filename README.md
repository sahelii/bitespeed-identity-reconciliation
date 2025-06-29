# Bitespeed Identity Reconciliation API

This is a Node.js backend service built with TypeScript, Express, Prisma, and PostgreSQL. It solves the identity reconciliation problem by linking users based on phone number and email.

## Tech Stack

- Node.js + TypeScript
- Express.js
- Prisma ORM + PostgreSQL
- Docker + Docker Compose
- Jest (unit and integration tests)

## Endpoints

### `POST /identify`

Accepts email and/or phone number, and returns primary and secondary contact(s).

### `GET /health`

Basic health check endpoint.

## Setup Instructions

1. Clone the repo
2. Set environment variables in `.env`
3. Run with Docker:
   ```bash
   docker compose up -d
