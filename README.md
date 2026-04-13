# FUTURE_FS_03 (ApexFit)

Full‑stack fitness membership platform:

- **Frontend**: Vite + React + TypeScript + Tailwind (shadcn/ui)
- **Backend**: Node.js + Express + MongoDB (Mongoose) + JWT auth
- **Realtime**: WebSocket (`/ws`) for server events (e.g., booking updates)

## Key Features

**Implemented in the API**

- Authentication: register, login, current user (`/api/auth/*`)
- Membership plans + subscriptions (subscribe/cancel) (`/api/memberships/*`)
  - On first run, seeds default membership plans if none exist
- Programs catalog (admin/trainer create; public list) (`/api/programs`)
- Bookings (member create; member/trainer/admin cancel; realtime emits) (`/api/bookings`)
- Progress tracking (daily entries + summary) (`/api/progress`)
- Blog posts (public read; admin CRUD) (`/api/blog/*`)
- Notifications inbox (per-user; admin can list all) (`/api/notifications*`)

**Implemented in the current UI**

- Marketing landing page (programs/trainers/pricing/testimonials)
- “Get Started” flow: **Sign up / Log in → Subscribe to a plan**

## Use Case Diagram

> Mermaid “use case” isn’t consistently supported everywhere, so this uses a simple flowchart-style use-case diagram.

```mermaid
flowchart LR
  %% Actors
  visitor([Visitor])
  member([Member])
  trainer([Trainer])
  admin([Admin])

  %% Use cases
  uc_browse([Browse programs & pricing])
  uc_register([Register])
  uc_login([Log in])
  uc_subscribe([Subscribe to plan])
  uc_cancelSub([Cancel subscription])
  uc_track([Track progress])
  uc_book([Book a training session])
  uc_cancelBooking([Cancel booking])
  uc_notifications([View notifications])

  uc_managePrograms([Manage programs])
  uc_managePlans([Manage membership plans])
  uc_manageUsers([Manage users/roles])
  uc_manageBlog([Manage blog posts])
  uc_viewAdminNotifs([View all notifications])

  %% Connections
  visitor --> uc_browse
  visitor --> uc_register
  visitor --> uc_login

  member --> uc_browse
  member --> uc_subscribe
  member --> uc_cancelSub
  member --> uc_track
  member --> uc_book
  member --> uc_cancelBooking
  member --> uc_notifications

  trainer --> uc_cancelBooking
  trainer --> uc_managePrograms
  trainer --> uc_notifications

  admin --> uc_managePrograms
  admin --> uc_managePlans
  admin --> uc_manageUsers
  admin --> uc_manageBlog
  admin --> uc_viewAdminNotifs
```

## Architecture Diagram

```mermaid
flowchart LR
  user([User Browser])

  subgraph FE[Frontend]
    fe[Vite + React (TS)
Tailwind + shadcn/ui]
  end

  subgraph BE[Backend]
    api[Express API
(/api/*)]
    ws[WebSocket server
(/ws)]
  end

  db[(MongoDB)]
  secret[[JWT_SECRET (.env)]]

  user -- HTTP --> fe
  fe -- REST /api --> api
  fe -- WS /ws?token=JWT --> ws
  api -- Mongoose --> db
  api -- signs/verifies JWT --> secret
  ws -- jwt.verify(token) --> secret
  api -- emits events --> ws

  note1[[Vite dev proxy:
/api -> http://localhost:4000
/ws  -> ws://localhost:4000]]
  fe --- note1
```

## Sequence Diagrams

### 1) Register/Login → Subscribe

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend (React)
  participant API as Backend (Express)
  participant DB as MongoDB

  U->>FE: Click "Get Started"
  alt New user
    FE->>API: POST /api/auth/register {email,password,fullName}
    API->>DB: Create User + hash password
    API-->>FE: {token, user}
  else Existing user
    FE->>API: POST /api/auth/login {email,password}
    API->>DB: Verify credentials
    API-->>FE: {token, user}
  end

  FE->>FE: Store token (localStorage: apexfit_token)
  FE->>API: POST /api/memberships/subscribe (Bearer token)
  API->>DB: Cancel active subs (if any)
  API->>DB: Create Subscription
  API->>DB: Create Notification (payment_success)
  API-->>FE: {subscription}
  FE-->>U: Show success toast
```

### 2) Member books a session → realtime event

```mermaid
sequenceDiagram
  autonumber
  actor M as Member
  participant FE as Frontend (React)
  participant API as Backend (Express)
  participant WS as WebSocket (/ws)
  participant DB as MongoDB
  actor T as Trainer

  FE->>WS: Connect /ws?token=JWT
  WS-->>FE: {type:"connected"}

  M->>FE: Book session (date/time)
  FE->>API: POST /api/bookings (Bearer token)
  API->>DB: Validate trainer + check overlap
  API->>DB: Create Booking
  API->>DB: Create Notification (booking_created)
  API->>WS: emit("booking.created", {bookingId}, [trainerId, memberId])
  WS-->>FE: {type:"booking.created", payload}
  FE-->>M: Update UI (if implemented)
  FE-->>T: Trainer receives event (if connected)
```

## Project Structure

```
backend/   # Express API, MongoDB models, routes, realtime WS
frontend/  # Vite + React UI
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB connection string (local MongoDB or Atlas)

### 1) Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

PowerShell alternative:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Backend runs at `http://localhost:4000`.

### 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:8080` and proxies:

- `/api` → `http://localhost:4000`
- `/ws` → `ws://localhost:4000`

## Environment Variables (Backend)

Create `backend/.env`:

| Name             | Required | Example                                       |
| ---------------- | -------: | --------------------------------------------- |
| `MONGODB_URI`    |       ✅ | `mongodb://127.0.0.1:27017/apexfit`           |
| `JWT_SECRET`     |       ✅ | `change-me-to-a-long-random-secret`           |
| `JWT_EXPIRES_IN` |       ❌ | `7d`                                          |
| `PORT`           |       ❌ | `4000`                                        |
| `CORS_ORIGIN`    |       ❌ | `http://localhost:8080,http://localhost:5173` |

## API Overview

Health

- `GET /api/health`

Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

Memberships

- `GET /api/memberships/plans`
- `POST /api/memberships/subscribe` (Bearer token)
- `POST /api/memberships/cancel` (Bearer token)

Programs

- `GET /api/programs`
- `POST /api/programs` (trainer/admin)
- `PATCH /api/programs/:id` (trainer/admin)
- `DELETE /api/programs/:id` (admin)

Bookings

- `GET /api/bookings` (Bearer token)
- `POST /api/bookings` (member)
- `POST /api/bookings/:id/cancel` (Bearer token)

Progress

- `GET /api/progress` (Bearer token)
- `PUT /api/progress` (Bearer token)
- `GET /api/progress/summary` (Bearer token)

Blog

- `GET /api/blog/posts`
- `GET /api/blog/posts/:slug`
- `POST /api/blog/posts` (admin)
- `PATCH /api/blog/posts/:id` (admin)
- `DELETE /api/blog/posts/:id` (admin)

Notifications

- `GET /api/notifications` (Bearer token)
- `POST /api/notifications/:id/read` (Bearer token)
- `DELETE /api/notifications/:id` (Bearer token)
- `GET /api/admin/notifications` (admin)

## Realtime (WebSocket)

Connect:

- `ws://<host>/ws?token=<JWT>`

Messages:

- `connected` (server confirms connection)
- `error` (e.g., unauthorized)
- `booking.created`, `booking.canceled` (emitted on booking changes)

---

If you want, I can also add an **ER diagram** (MongoDB collections) using Mermaid `erDiagram` based on the models in `backend/src/models/`.
