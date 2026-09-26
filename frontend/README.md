# 💻 Flipkart Frontend Client

Modern, responsive React 19 single-page application built with TypeScript, Tailwind CSS v4, and Lucide icons, replicating the enterprise Flipkart desktop and mobile shopping experience.

## Directory Structure

```
frontend/
├── public/                 # Static assets, brand logos, icons
├── src/
│   ├── components/         # Modular Flipkart UI components
│   │   ├── address/        # Saved addresses, multi-address manager modal
│   │   ├── admin/          # Platform metrics, revenue overview & order status portal
│   │   ├── ai/             # Conversational shopping assistant (Gemini Genie)
│   │   ├── auth/           # Login & registration modal with quick demo accounts
│   │   ├── cart/           # Shopping cart drawer with price breakdown
│   │   ├── checkout/       # 4-step accordion checkout with UPI/Card/COD
│   │   ├── common/         # Toast notification container
│   │   ├── home/           # Hero banners, Deal of the Day section with countdown timer
│   │   ├── layout/         # Header/Navbar with autocomplete, CategoryBar, Footer
│   │   ├── orders/         # Ekart live tracking timeline modal & invoice generator
│   │   ├── product/        # ProductCard, ProductDetailModal, faceted filter sidebar
│   │   └── seller/         # Seller Hub onboarding & product listing modal
│   ├── context/            # StoreContext (Global cart, wishlist, auth & filter state)
│   ├── services/           # apiClient for typed HTTP communication with backend
│   ├── types/              # Frontend domain models & API response types
│   ├── App.tsx             # Primary application layout & modal orchestrator
│   ├── index.css           # Global stylesheet & Tailwind CSS imports
│   └── main.tsx            # React application entry point (DOM mount)
├── package.json            # Frontend package descriptor
├── tsconfig.json           # TypeScript configuration
└── README.md               # Frontend architecture overview
```

## State Architecture
- `StoreContext`: Manages user credentials, active modal states, cart items, delivery addresses, wishlist IDs, active filter facets, and toast notifications with local storage persistence.
- `apiClient`: Typed HTTP client targeting `/api/*` routes with automatic `x-user-id` and session token injection.
