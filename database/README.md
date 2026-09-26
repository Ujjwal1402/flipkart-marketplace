# 🗄️ Database Module

This module encapsulates all persistence models, seed catalogs, and the data access repository layer for the Flipkart Marketplace platform.

## Directory Structure

```
database/
├── schema/
│   └── models.ts       # Domain entity interfaces (User, Product, Order, Address, etc.)
├── seeders/
│   └── seedData.ts     # Verified category data, initial products catalog, seed accounts
├── dbClient.ts         # Singleton thread-safe query engine & transactional methods
├── index.ts            # Public facade re-exporting schemas, seeders, and db instance
└── README.md           # Documentation for database architecture and entities
```

## Entities & Schemas

- **Product**: Catalog records with pricing, discount %, F-Assured status, rating, reviews, stock quantity, bank offers, and full specifications.
- **User**: Customer and Admin records with hashed credentials, role-based authorization flags, SuperCoins balance, and saved delivery addresses.
- **UserAddress**: Multi-address records with Indian 6-digit PIN validation, locality, city, state, and HOME/WORK tags.
- **Order**: Purchase records with generated Ekart AWB tracking codes (`FKOD...`), pricing breakdown, payment method details, and 5-stage shipment progression history.
- **Category**: Top-level retail categories with dynamic slugs and subcategory taxonomies.
- **Seller**: Verified vendor profiles with GSTIN, business verification badges, and product listing permissions.

## Security & Secrets Policy

In accordance with strict security standards, no passwords, API tokens, or secrets are committed. Passwords in seed data are strictly for local sandbox demonstration.
