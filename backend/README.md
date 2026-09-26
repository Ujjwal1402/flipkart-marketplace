# ⚙️ Flipkart Backend Service

Production-grade Express.js application handling REST API endpoints, business validation, pricing algorithms, logistics progression, and AI conversational search.

## Directory Structure

```
backend/
├── src/
│   ├── config/             # Environment constants, platform fee rules, limits
│   ├── controllers/        # Request handling, validation & HTTP responses
│   │   ├── adminController.ts    # Revenue metrics & order status transitions
│   │   ├── aiController.ts       # Gemini AI Shopping Genie endpoint
│   │   ├── authController.ts     # Customer & admin auth with session token
│   │   ├── cartController.ts     # Cart operations & calculation requests
│   │   ├── orderController.ts    # Checkout, address book CRUD, order history
│   │   ├── productController.ts  # Catalog, faceted search, suggestions
│   │   └── sellerController.ts   # Merchant dashboard & inventory
│   ├── middlewares/        # Error handlers, audit logging, RBAC guards
│   ├── routes/             # Centralized routing definitions under /api
│   ├── services/           # Decoupled business logic & transaction engines
│   └── app.ts              # Express application factory & middleware stack
├── package.json            # Backend package descriptor
└── README.md               # Backend architecture overview
```

## Security & Middleware
- **Request Logger**: Structured audit log with timestamp, method, path, and duration.
- **Role-Based Access Control**: `/api/admin/*` endpoints strictly require `admin` role header or authenticated user record.
- **Error Middleware**: Consistent error payload format `{ success: false, error: { code, message } }`.
