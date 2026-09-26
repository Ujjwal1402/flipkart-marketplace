# 📡 API Reference Documentation

All endpoints are served under the `/api` prefix.

## 1. Authentication (`/api/auth`)

### `POST /api/auth/login`
Authenticate customer or admin user.
- **Payload**: `{ "emailOrPhone": "ujjwal14022003@gmail.com", "password": "Customer@123" }`
- **Response**: `{ "success": true, "data": { "user": User, "token": string } }`

### `POST /api/auth/register`
Register new customer account.
- **Payload**: `{ "name": "Jane Doe", "email": "jane@example.com", "phone": "9876543210", "password": "Password123" }`

### `GET /api/auth/me`
Retrieve currently authenticated user session.
- **Headers**: `x-user-id: usr-default`

---

## 2. Catalog & Search (`/api/products`)

### `GET /api/products`
Query catalog with multi-facet filters.
- **Query Params**:
  - `category`: Category slug (e.g., `mobiles`, `electronics`, `all`)
  - `search`: Search keyword (e.g., `apple`, `samsung`)
  - `minPrice`, `maxPrice`: Numerical price boundaries
  - `rating`: Minimum customer star rating (e.g., `4`)
  - `isFAssured`: Boolean (`true`)
  - `brand`: Comma-separated brands (e.g., `Apple,Samsung`)
  - `sortBy`: `popularity` | `price_low` | `price_high` | `discount`

### `GET /api/products/suggestions`
Live debounced search suggestions.
- **Query Params**: `q`: Substring query (e.g., `sam`)
- **Response**: Array of `{ text: string, type: 'brand' | 'category' | 'product', category?: string }`

### `GET /api/products/:id`
Retrieve full product details with specifications, image gallery, and bank offers.

### `GET /api/products/deals`
Retrieve featured "Deals of the Day".

---

## 3. Cart Operations (`/api/cart`)

### `GET /api/cart`
Retrieve cart items and live price breakdown with SuperCoins and coupons applied.
- **Query Params**: `couponCode`, `useSuperCoins`
- **Headers**: `x-user-id: usr-default`

### `POST /api/cart/add`
Add product to cart.
- **Payload**: `{ "productId": "prod-iphone15", "quantity": 1 }`

### `POST /api/cart/update`
Update item quantity.
- **Payload**: `{ "productId": "prod-iphone15", "quantity": 2 }`

### `POST /api/cart/remove`
Remove item from cart.
- **Payload**: `{ "productId": "prod-iphone15" }`

---

## 4. Checkout & Orders (`/api/orders`)

### `POST /api/orders/checkout`
Place verified order with address and payment method.
- **Payload**:
  ```json
  {
    "addressId": "addr-home",
    "paymentMethod": "UPI" | "CARD" | "NETBANKING" | "COD",
    "couponCode": "FLIPKART500",
    "useSuperCoins": true
  }
  ```

### `GET /api/orders`
List past orders for authenticated user.

### `GET /api/orders/:id`
Get detailed order status, Ekart logistics progression steps, and invoice data.

### `POST /api/orders/:id/cancel`
Cancel an existing order.

---

## 5. Address Book (`/api/user/address`)

- `POST /api/user/address`: Add new delivery address.
- `PUT /api/user/address/:id`: Update existing address.
- `DELETE /api/user/address/:id`: Delete address.
- `PATCH /api/user/address/:id/default`: Set as default address.

---

## 6. Admin Portal (`/api/admin`)
*Requires `x-user-id` with `admin` role or `x-user-role: admin`.*

- `GET /api/admin/metrics`: Platform revenue, total orders, users, and low stock count.
- `GET /api/admin/orders`: Complete list of platform orders.
- `PATCH /api/admin/orders/:id/status`: Transition shipment stage (`PACKED`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`).

---

## 7. Seller Hub (`/api/seller`)

- `GET /api/seller/dashboard`: Vendor analytics and inventory status.
- `POST /api/seller/products`: Add vendor product to marketplace catalog.

---

## 8. AI Shopping Assistant (`/api/ai/chat`)

- `POST /api/ai/chat`: Interactive natural language product recommendations powered by Gemini.
