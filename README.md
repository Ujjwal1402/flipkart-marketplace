# 🛒 Flipkart Enterprise E-Commerce Platform

A production-grade, company-style full-stack e-commerce marketplace platform inspired by **Flipkart.com**. Built with a strict MNC decoupled architecture across **Frontend**, **Backend**, and **Database** tiers, with automated testing, CI, Docker containerization, and developer documentation.

---

## 🏗️ Repository Architecture & Directory Structure

```
project-root/
│
├── frontend/                     # Presentation Layer (React 19 + TypeScript + Tailwind CSS)
│   ├── public/                  # Static assets & brand media
│   ├── src/
│   │   ├── components/          # Reusable Flipkart design-system UI components
│   │   │   ├── address/         # Multi-address manager modal with PIN validation
│   │   │   ├── admin/           # Platform metrics & order progression admin portal
│   │   │   ├── ai/              # Gemini AI Shopping Genie assistant
│   │   │   ├── auth/            # Customer & admin login/register modal
│   │   │   ├── cart/            # Shopping cart drawer with price breakdown
│   │   │   ├── checkout/        # 4-step accordion checkout with UPI/Card/COD
│   │   │   ├── common/          # Toast notification alerts
│   │   │   ├── home/            # Hero carousel & deal countdown sections
│   │   │   ├── layout/          # Navbar with live autocomplete, CategoryBar, Footer
│   │   │   ├── orders/          # Ekart logistics timeline & invoice generator
│   │   │   ├── product/         # ProductCard, ProductDetailModal, filter sidebar
│   │   │   └── seller/          # Seller Hub vendor portal & inventory
│   │   ├── context/             # Global StoreContext with local persistence
│   │   ├── services/            # Typed apiClient targeting /api endpoints
│   │   ├── types/               # Domain interfaces & state definitions
│   │   ├── App.tsx              # Main viewport layout & modal orchestrator
│   │   ├── index.css            # Tailwind CSS v4 styling rules
│   │   └── main.tsx             # React application DOM entry point
│   ├── package.json             # Frontend package configuration
│   ├── tsconfig.json            # Frontend TypeScript configuration
│   └── README.md                # Frontend documentation
│
├── backend/                      # Application & API Layer (Node.js + Express)
│   ├── src/
│   │   ├── config/              # Application constants & marketplace fee policies
│   │   ├── controllers/         # HTTP request handlers & validation
│   │   ├── middlewares/         # Audit logging, errorHandler, RBAC guards
│   │   ├── routes/              # Centralized route registrations (/api/*)
│   │   ├── services/            # Decoupled business logic & transaction engines
│   │   └── app.ts               # Express application setup & middleware stack
│   ├── package.json             # Backend package configuration
│   └── README.md                # Backend documentation
│
├── database/                     # Persistence & Data Layer
│   ├── schema/
│   │   └── models.ts            # Typed entity models (User, Product, Order, etc.)
│   ├── seeders/
│   │   └── seedData.ts          # Realistic verified product catalog & seed data
│   ├── dbClient.ts              # Global singleton thread-safe query engine
│   ├── index.ts                 # Clean facade re-exporting schemas and db instance
│   └── README.md                # Database design and entity relationships
│
├── docs/                         # Technical Documentation
│   ├── architecture/
│   │   └── ARCHITECTURE.md      # Decoupled system design & architectural principles
│   └── api/
│   │   └── API_REFERENCE.md     # Full REST API endpoint reference
│
├── tests/                        # Automated Test Suites
│   ├── integration/
│   │   └── api.test.ts          # Integration tests (Auth, Catalog, Cart, Address, RBAC)
│   ├── e2e/
│   │   └── checkout-flow.test.ts# Complete user purchase & Ekart tracking flow
│   └── run-tests.ts             # Native test execution runner
│
├── .github/                      # CI/CD Workflows
│   └── workflows/
│       └── ci.yml               # GitHub Actions for lint, test, and build
│
├── .env.example                  # Environment variable template
├── .gitignore                    # Standard Git exclusions
├── docker-compose.yml            # Multi-container orchestration
├── Dockerfile                    # Multi-stage production container build
├── server.ts                     # Full-stack runtime entry point
└── package.json                  # Root monorepo build & script coordinator
```

---

## 🔑 Demo Accounts

| Role | Email / Identifier | Password | Included Permissions |
|---|---|---|---|
| **Customer (Plus Member)** | `ujjwal14022003@gmail.com` | `Customer@123` | Browsing, Cart, SuperCoins, 4-step Checkout, Ekart Tracking |
| **Platform Administrator** | `admin@flipkart.com` | `Admin@123` | Operational Metrics, Revenue Overview, Ekart Shipment Status Updates |

*Quick-access buttons ("⚡ Use Customer Demo" and "⚡ Use Admin Demo") are provided inside the login and checkout views for instant evaluation.*

---

## 🛠️ Commands & Scripts

### 1. Run Development Server
```bash
npm run dev
```
Starts the full-stack Express server on port `3000` with hot-mounted Vite client middleware.

### 2. Run Automated Test Suites
```bash
npm test
```
Executes both the Integration and End-to-End checkout simulation suites with assertion reporting.

### 3. Run Typecheck / Lint
```bash
npm run lint
```
Runs `tsc --noEmit` across all modules to ensure zero type errors.

### 4. Build for Production
```bash
npm run build
```
Generates minified static assets in `dist/` and compiles the server into `dist/server.cjs`.

### 5. Start Production Server
```bash
npm start
```
Runs the standalone production bundle on `http://localhost:3000`.

### 6. Run with Docker
```bash
docker-compose up --build
```
Builds the multi-stage image and boots the containerized platform on port 3000 with healthcheck probes.
