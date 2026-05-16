# COMP3036 Major Assignment — Full Stack Store

This project was originally based on the Assignment 2 blog application and has been extended into a B2C full stack digital product store for the COMP3036 Major Assignment.

The application focuses on selling digital developer resources such as:
- Full stack starter templates
- Tailwind UI component packs
- Dashboard templates
- Backend toolkits
- Developer productivity resources

The project contains:
- Customer shopping application
- Admin dashboard
- Product management system
- Shopping cart and checkout flow
- Wishlist functionality
- Customer authentication
- Order history system

---

# Success Criteria

- ✅ All tests must pass
- ✅ Customer and admin applications function correctly
- ✅ Products sync correctly between admin and customer applications
- ✅ Customers can complete the shopping experience

---

# Requirements — Iteration 1 Frontend Implementation

Iteration 1 focuses on frontend functionality using local state and frontend-only persistence.

## Customer Application

### Home Screen
- [ ] Display active products only
- [ ] Display product categories
- [ ] Display product collections/tags
- [ ] Display featured products
- [ ] Support dark/light mode
- [ ] Search products by title or description
- [ ] Display:
  - product title
  - product image
  - product description
  - product price
  - category
  - collections/tags

### Product Detail Screen
- [ ] Display full product information
- [ ] Display large product image
- [ ] Display pricing information
- [ ] Add products to cart
- [ ] Save products to wishlist
- [ ] Display related products
- [ ] Display product availability status

### Category / Collection / Search Screens
- [ ] Filter products by category
- [ ] Filter products by collection/tag
- [ ] Search products using query strings
- [ ] Display empty states when no products are found

### Customer Account Features
- [ ] Customer registration
- [ ] Customer login/logout
- [ ] Account overview page
- [ ] Wishlist page
- [ ] Order history page

### Shopping Cart and Checkout
- [ ] Add/remove products from cart
- [ ] Update product quantities
- [ ] Display order summary
- [ ] Frontend-only checkout flow
- [ ] Prevent checkout for unavailable products
- [ ] Display unavailable product warnings
- [ ] Save completed orders locally

---

# Admin Dashboard

## Admin Authentication
- [ ] Secure admin login
- [ ] Protected admin pages
- [ ] Logout functionality

## Product Management
- [ ] View all products
- [ ] Create products
- [ ] Update products
- [ ] Activate/deactivate products
- [ ] Filter products
- [ ] Sort products
- [ ] Preview product details
- [ ] Validate form fields
- [ ] Sync products with customer application

---

# Requirements — Iteration 2 Backend Integration

Iteration 2 extends the application using backend APIs and database persistence.

## Backend / Customer Features

### Product Data
- [ ] Load products from database
- [ ] Persist product changes across refreshes
- [ ] Sync customer and admin product data
- [ ] Perform server-side filtering and searching

### Shopping Cart
- [ ] Persist cart items
- [ ] Prevent checkout for unavailable products
- [ ] Update cart data using backend APIs

### Wishlist
- [ ] Persist wishlist items to database
- [ ] Allow customers to view saved products

### Orders and Checkout
- [ ] Store completed orders in database
- [ ] Display purchase history
- [ ] Store purchased products and totals

### Customer Authentication
- [ ] JWT-based authentication
- [ ] Secure customer login/register
- [ ] Protected customer account routes

---

# Backend / Admin Features

## Admin Authentication
- [ ] Validate admin login on the server
- [ ] Use secure JWT authentication
- [ ] Protect admin routes
- [ ] Support logout functionality

## Product Management
- [ ] Create products in database
- [ ] Update products in database
- [ ] Activate/deactivate products
- [ ] Persist product changes
- [ ] Sync updates with customer application

## Admin Dashboard
- [ ] View all database products
- [ ] Filter and sort products
- [ ] Manage active/inactive products
- [ ] View customer purchase records

---

# Database Integration

The backend system will use:
- Prisma ORM
- Neon PostgreSQL
- Next.js API routes
- JWT authentication

The backend will manage:
- Product persistence
- Customer accounts
- Orders and purchase history
- Wishlist persistence
- Product availability
- Authentication and authorization

---

# Technology Stack

## Applications
- `apps/web` — Customer Store
- `apps/admin` — Admin Dashboard

## Shared Packages
- `packages/ui` — Shared UI components
- `packages/utils` — Shared utility functions
- `packages/db` — Prisma and database utilities
- `packages/env` — Environment configuration

## Testing
- `tests/playwright` — End-to-end testing

---

# Running the Project

Install dependencies:

```bash
pnpm install
```

Run development servers:

```bash
turbo dev
```

Applications:
- Customer Store → http://localhost:3001
- Admin Dashboard → http://localhost:3002

---

# Running Tests

## Customer Store Tests

Run customer storefront tests:

```bash
turbo test-1
```

This includes:
- Product browsing
- Product detail pages
- Search and filtering
- Cart and checkout
- Customer account features
- Wishlist functionality

---

## Admin Dashboard Tests

Run admin dashboard tests:

```bash
turbo test-2
```

This includes:
- Admin authentication
- Product management
- Product create/update
- Product filtering/sorting
- Product activation/deactivation

---

## Full Project Tests

Run all project tests:

```bash
turbo all:test
```

---

# Build Project

```bash
turbo build
```

---

# Project Structure

```text
apps/
  admin/
  web/

packages/
  db/
  env/
  ui/
  utils/

tests/
  playwright/
  storybook/
```

---

# Notes

- Iteration 1 currently uses frontend/localStorage persistence
- Iteration 2 will integrate Neon PostgreSQL with Prisma
- Customer and admin applications share synchronized product state
- The project uses a Turborepo monorepo architecture