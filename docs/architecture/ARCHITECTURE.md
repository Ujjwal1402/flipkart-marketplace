# 🏛️ System Architecture & Design

## Overview

The Flipkart Marketplace platform is designed using a 3-tier decoupled enterprise architecture:
1. **Presentation Layer (`frontend/`)**: React 19 SPA running on modern Vite with Tailwind CSS.
2. **API & Business Logic Layer (`backend/`)**: Node.js + Express REST API with Controller-Service separation and error middleware.
3. **Data Layer (`database/`)**: In-memory transactional repository with typed domain schemas, relational index maps, and seed catalogs.

```
┌─────────────────────────────────────────────────────────────┐
│                 React 19 Frontend SPA                       │
│  (Navbar, Search, Catalog, Cart, Checkout, Ekart Tracking)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express.js Backend API                      │
│   Controllers ───► Services ───► Validation & Calculations  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Native Method Invocation
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Database Repository Engine                    │
│   Users, Products, Categories, Orders, Carts, Wishlists      │
└─────────────────────────────────────────────────────────────┘
```

## Key Architectural Principles

1. **Strict Separation of Concerns**:
   - `frontend/` never accesses the database directly; it communicates exclusively through `/api/*` endpoints.
   - `backend/` handles all pricing arithmetic, stock deduction, and status state machines.
   - `database/` encapsulates all data structures, ensuring thread-safe operations in memory.

2. **Cart & Pricing Engine**:
   - Platform fee policy: ₹3 fixed per order.
   - Free shipping: For all orders above ₹500, or ₹40 delivery fee for smaller carts.
   - SuperCoins loyalty: 1 coin = ₹1 discount (up to ₹200 off), earned at 2 coins per ₹100 spent (doubled for Plus members).

3. **Logistics Progression Engine (Ekart)**:
   - Order generation assigns an Ekart AWB number (`FKOD...`).
   - 5-stage shipment progression: `PLACED` → `PACKED` → `SHIPPED` → `OUT_FOR_DELIVERY` → `DELIVERED`.
   - Real-time updates via admin console status transitions.

4. **Security & Route Guards**:
   - Simulated JWT token authentication (`fk_sess_*`).
   - RBAC enforcement on `/api/admin/*` routes (`403 Forbidden` for non-admin callers).
   - Input sanitation and validation on PIN codes, mobile numbers, and payment details.
