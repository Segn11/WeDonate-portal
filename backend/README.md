# Adama Support Portal — Backend API

> Node.js + Express + Prisma + PostgreSQL

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Then edit .env with your PostgreSQL credentials
```

### 3. Generate Prisma client & run migrations
```bash
npm run prisma:generate
# Once your PostgreSQL DB is running:
npm run prisma:migrate
```

### 4. Start development server
```bash
npm run dev
```

Server will run on: `http://localhost:5000`

---

## API Routes Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | No | Login with email/password |
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/google` | No | Google OAuth login |
| GET | `/api/v1/auth/me` | Yes | Get current user profile |
| GET | `/api/v1/requests` | No | List all requests (filterable) |
| GET | `/api/v1/requests/check-duplicate` | No | Duplicate National ID check |
| GET | `/api/v1/requests/:id` | No | Get single request details |
| POST | `/api/v1/requests` | Yes | Submit new support request |
| PATCH | `/api/v1/requests/:id/status` | Admin | Update request status |
| GET | `/api/v1/donations` | Yes | List donations |
| POST | `/api/v1/donations` | Yes | Make a donation |
| GET | `/api/v1/distributions` | Yes | List distribution records |
| POST | `/api/v1/distributions` | Admin | Record a new distribution |
| GET | `/api/v1/distributions/verify/:code` | No | Verify a receipt code (public) |
| GET | `/api/v1/meta/kebeles` | No | List all Adama Kebeles |
| GET | `/api/v1/meta/woredas` | No | List all Adama Woredas |
| GET | `/health` | No | Health check |
