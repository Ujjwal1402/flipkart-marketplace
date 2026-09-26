Flipkart Marketplace
A full-stack e-commerce marketplace web application inspired by Flipkart, built with React 19, TypeScript, Tailwind CSS v4, and Express.js. The project separates the React client (frontend/), Express REST API (backend/), and in-memory data repository (database/) into distinct modules served through a unified Node.js server.
Features
Product Catalog & Filtering: Browse products across 6 categories (Mobiles, Electronics, Fashion, Appliances, Home & Furniture, Grocery) with multi-facet filtering by category, price range, brand, customer rating, and Flipkart Assured status, plus sorting by popularity, price, or discount.
Debounced Search & Autocomplete: Live search bar querying /api/products/suggestions for matching products, brands, and categories.
Shopping Cart & Price Calculation: Add, update, and remove items with automatic price calculation including MRP discounts, a fixed ₹3 platform fee, delivery charges (₹40, or free on orders above ₹500), promo codes (FLIPKART500, BIGBILLION10, WELCOME200), and SuperCoins loyalty points redemption.
4-Step Accordion Checkout:
Account authentication check
Delivery address selection or new address creation (with 6-digit Indian PIN code validation)
Order summary review
Simulated payment processing (UPI, Credit/Debit Card, NetBanking, EMI, and Cash on Delivery with captcha verification)
Order Tracking & Invoice View: Generates an order with a simulated Ekart Logistics tracking ID (FKOD...), a 5-stage shipment status timeline (PLACED → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED), order cancellation support, and a printable order invoice view.
User Authentication & Address Book: Email or mobile number login, user registration, wishlist toggling, and full CRUD management for saved HOME and WORK delivery addresses.
Admin Console: Role-protected dashboard (admin role) for viewing store metrics (total revenue, order counts, low-stock items), advancing order shipment stages, updating product stock, and adding or deleting catalog products.
Seller Hub: Vendor portal displaying seller metrics, product inventory, and a form to list new products in the catalog.
AI Shopping Assistant: Conversational modal (POST /api/ai/assistant) powered by the Google Gen AI SDK (@google/genai, gemini-2.5-flash) when GEMINI_API_KEY is provided, with an automatic rule-based keyword fallback when running without an API key.
Tech Stack
Frontend
React (^19.0.1) & React DOM (^19.0.1)
TypeScript (^7.0.2)
Tailwind CSS (^4.3.3) with @tailwindcss/vite (^4.3.3)
Lucide React (^0.546.0) for icons
Motion (^12.23.24) for UI transitions
React Context API + localStorage for client state management
Backend
Node.js (tested on Node.js 20.x and 22.x)
Express.js (^4.21.2)
dotenv (^17.2.3)
Google Gen AI SDK (@google/genai ^2.4.0)
Database / Storage
In-Memory Data Store (database/dbClient.ts): Singleton DatabaseClient class backed by JavaScript Map and Set collections, pre-populated on server startup from database/seeders/seedData.ts. Data persists in memory while the server process is running and resets on server restart.
Build, Testing & Infrastructure
Vite (^8.3.0) & @vitejs/plugin-react (^6.1.1) for frontend bundling
esbuild (^0.25.0) for bundling the Express server into dist/server.cjs
tsx (^4.21.0) for running TypeScript directly in development and testing
Docker (node:22-alpine multi-stage build) & Docker Compose
GitHub Actions (.github/workflows/ci.yml)
Architecture
The application runs as a single Node.js service (server.ts) on port 3000 that mounts the Express REST API (/api/*) alongside the frontend client:
Presentation Layer (frontend/src/): React 19 single-page application. All UI components communicate with the backend through a typed fetch client (frontend/src/api/client.ts) and never access the database module directly.
API & Service Layer (backend/src/): Express router (apiRoutes.ts) delegating HTTP requests to controllers (auth, product, cart, order, seller, admin, ai) and domain services (cartService, orderService, productService, sellerService, aiService).
Data Layer (database/): Strongly typed interfaces (database/schema/models.ts), seed catalog (database/seeders/seedData.ts), and the in-memory DatabaseClient (database/dbClient.ts).
In development mode (NODE_ENV !== 'production'), server.ts attaches Vite's development middleware for hot reload. In production mode (NODE_ENV=production), Express serves the static frontend build from dist/.
Project Structure
code
Text
flipkart-marketplace/
├── .github/workflows/ci.yml      # GitHub Actions workflow (lint, test, build)
├── backend/
│   ├── src/
│   │   ├── config/               # Fee constants and configuration
│   │   ├── controllers/          # Express route handlers
│   │   ├── middlewares/          # Request logger and error handler
│   │   ├── routes/apiRoutes.ts   # REST API endpoint definitions (/api/*)
│   │   ├── services/             # Cart, order, product, seller, and AI logic
│   │   └── app.ts                # Express app configuration
│   └── README.md
├── database/
│   ├── schema/models.ts          # TypeScript domain interfaces
│   ├── seeders/seedData.ts       # Initial categories, products, sellers, and demo users
│   ├── dbClient.ts               # In-memory data store implementation
│   ├── index.ts                  # Database module exports
│   └── README.md
├── docs/
│   ├── api/API_REFERENCE.md      # REST API endpoint documentation
│   └── architecture/ARCHITECTURE.md
├── frontend/
│   ├── src/
│   │   ├── api/client.ts         # Frontend HTTP client for /api/*
│   │   ├── components/           # UI components (layout, product, cart, checkout, admin, seller, ai)
│   │   ├── context/StoreContext.tsx
│   │   ├── types/                # Frontend TypeScript interfaces
│   │   ├── App.tsx               # Main application view
│   │   └── main.tsx              # React DOM entry point
│   └── README.md
├── tests/
│   ├── integration/api.test.ts   # Auth, catalog, cart, and address book tests
│   ├── e2e/checkout-flow.test.ts # Checkout and order status progression tests
│   └── run-tests.ts              # Custom TypeScript test runner
├── .env.example                  # Environment variable template
├── Dockerfile                    # Multi-stage Node 22 Alpine container build
├── docker-compose.yml            # Container orchestration config
├── index.html                    # Vite HTML entry point
├── package.json                  # Project dependencies and npm scripts
├── server.ts                     # Unified Express + Vite server entry point
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite bundler configuration
Getting Started
Prerequisites
Node.js: v20.x or v22.x (CI runs on Node 20 and 22; Docker uses node:22-alpine)
npm: Included with Node.js
Clone Repository
code
Bash
git clone https://github.com/Ujjwal1402/flipkart-marketplace.git
cd flipkart-marketplace
Install Dependencies
All frontend and backend dependencies are managed at the repository root:
code
Bash
npm install
Environment Variables
Create a .env file in the root directory by copying .env.example:
code
Bash
cp .env.example .env
Available variables in .env.example:
code
Env
# Server & Runtime Configuration
PORT=3000
NODE_ENV=development

# Google Gemini AI API Key (Optional: falls back to rule-based responses if left empty)
GEMINI_API_KEY=""

# Application Host URL
APP_URL="http://localhost:3000"
Note: GEMINI_API_KEY is optional for local development. If omitted, the AI Shopping Assistant automatically uses its built-in rule-based product matcher. Note that server.ts binds to port 3000.
Run Development Server
code
Bash
npm run dev
Open http://localhost:3000 in your browser.
Demo Accounts
The in-memory database seeds two local development/testing accounts on startup. You can sign in using the one-click "⚡ Use Customer Demo" and "⚡ Use Admin Demo" buttons inside the Login modal, or enter the following development credentials manually:
Role	Identifier (Phone / Email)	Password (Local Demo Only)	Capabilities
Customer (Plus Member)	+91 98765 00140	Customer@123	Browse catalog, manage cart & addresses, apply SuperCoins, place orders, track shipments
Administrator	admin@flipkart.com (or +91 99999 88888)	Admin@123	Access Admin Console, view store metrics, update order shipment statuses, manage inventory
These credentials exist strictly in local seed data (database/seeders/seedData.ts) for testing purposes.
Available Scripts
All scripts are defined in the root package.json:
Command	Description
npm run dev	Runs tsx server.ts to start the Express API and Vite development middleware on http://localhost:3000.
npm test	Runs tsx tests/run-tests.ts to execute the integration and end-to-end test suites.
npm run lint	Runs tsc --noEmit to type-check all TypeScript files across frontend, backend, database, and tests.
npm run build	Builds the frontend static assets (vite build) and bundles the server (esbuild server.ts) into dist/server.cjs.
npm start	Starts the compiled production server (node dist/server.cjs) on port 3000.
npm run preview	Runs vite preview to preview the static frontend bundle.
npm run clean	Removes the dist/ directory and temporary build artifacts (rm -rf dist server.js).
Testing
The project uses a custom TypeScript test runner (tests/run-tests.ts) with 21 assertions across two suites:
code
Bash
npm test
Integration Tests (tests/integration/api.test.ts — 12 checks):
Customer and admin authentication and invalid credential rejection
Product catalog retrieval, category filtering (mobiles), and search autocomplete (sam)
Cart item counting, fixed ₹3 platform fee enforcement, and payable total calculation
User registration and address book creation, update, and deletion
End-to-End Checkout Flow (tests/e2e/checkout-flow.test.ts — 9 checks):
Customer lookup, cart population, delivery address selection, order creation (PLACED), Ekart tracking number generation (FKOD...), automatic cart clearing after checkout, and admin status progression to SHIPPED.
Production Build
To build and run the compiled application locally:
code
Bash
# 1. Build frontend assets and server bundle into dist/
npm run build

# 2. Run the compiled server in production mode
NODE_ENV=production npm start
The server will serve the static bundle from dist/ and listen on http://localhost:3000.
Docker
The repository includes a multi-stage Dockerfile (node:22-alpine) and docker-compose.yml with a healthcheck against http://localhost:3000/api/health.
code
Bash
# Build and start the container
docker compose up --build
To run in detached mode or stop the container:
code
Bash
docker compose up -d --build
docker compose down
CI/CD
GitHub Actions is configured in .github/workflows/ci.yml and triggers on pushes and pull requests to main, master, and develop. It runs a matrix build across Node.js 20.x and 22.x performing:
Repository checkout (actions/checkout@v4)
Node.js setup with npm cache (actions/setup-node@v4)
Dependency installation (npm ci || npm install)
TypeScript type checking (npm run lint)
Automated test execution (npm test)
Application bundle build (npm run build)
Documentation
Additional module and API documentation is available in the repository:
System Architecture (docs/architecture/ARCHITECTURE.md)
REST API Reference (docs/api/API_REFERENCE.md)
Frontend Module Overview (frontend/README.md)
Backend Module Overview (backend/README.md)
Database & Seed Schema Overview (database/README.md)
Security / Environment Variables
Never commit .env files, API keys (such as GEMINI_API_KEY), or private credentials to version control.
.gitignore is configured to exclude .env* files while keeping .env.example tracked as a safe template.
Authentication in this project uses an in-memory store with plain-text seed passwords and simulated session tokens (fk_sess_*) intended strictly for local demonstration and development.