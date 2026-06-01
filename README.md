# Full Stack Store

This project was originally based on the Assignment 2 blog application and was extended into a B2C full stack digital product store for the COMP3036 Major Assignment.
## Project Overview

This project is a full stack digital product storefront built for COMP3036 Full Stack Development.

It includes:
- A customer application for browsing and purchasing products
- An admin dashboard for managing products and viewing customer orders
- A shared backend database used by both applications

Iteration 1 focused on frontend functionality.

Iteration 2 added backend and database functionality.

## Documentation

### API Documentation

Detailed API documentation is available here:

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Iteration Summary

### Iteration 1
Implemented the customer storefront and admin dashboard user interfaces using frontend state and local persistence.

### Iteration 2
Integrated Prisma and PostgreSQL, added authentication, order persistence, product persistence, stock management, and customer order history.

## Technology Stack

### Storefront
- Next.js
- React
- TypeScript

### Admin
- Next.js
- React
- TypeScript

### Backend
- Prisma ORM
- PostgreSQL / Neon

### Authentication
- NextAuth
- `bcryptjs`
- JWT

### Testing
- Playwright
- GitHub Actions

## Implemented Features

### Customer Features
- Browse products
- Search products
- Filter by category
- Filter by collection/tag
- View product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Customer registration
- Customer login/logout
- Protected checkout
- Mock payment checkout
- Purchase history
- Wishlist functionality

### Admin Features
- Admin login/logout
- View products
- Create products
- Edit products
- Manage active/inactive products
- Filter products
- Sort products
- View customer order records

### Database Features
- Products stored in PostgreSQL
- Users stored in PostgreSQL
- Orders stored in PostgreSQL
- Order items stored in PostgreSQL
- Product stock quantity management
- Shared database between customer and admin applications
- All product, user, order, and stock data is shared between the customer storefront and admin dashboard through the same PostgreSQL database.

## Authentication

### Customer Authentication
- Customer registration
- Customer login/logout
- Password hashing using `bcryptjs`
- NextAuth JWT sessions
- Protected checkout
- Protected order history

### Admin Authentication
- Password-based admin login
- JWT authentication cookie
- Protected admin dashboard
- Protected admin product management
- Protected customer order records

## Database

### Product
- title
- description
- category
- image
- price
- stock quantity
- active status
- tags

### User
- name
- email
- password hash
- role

### Order
- customer
- order status
- total amount

### Order Item
- product
- quantity
- purchase price

## Running Locally

Installation:

```bash
pnpm install
```

Generate Prisma client:

```bash
pnpm --filter @repo/db db:generate
```

Push database schema:

```bash
pnpm --filter @repo/db db:push
```

Start development servers:

```bash
turbo dev
```

Storefront:
`http://localhost:3001`

Admin:
`http://localhost:3002`

## Testing

Storefront tests:

```bash
turbo test-1
```

Admin tests:

```bash
turbo test-2
```

Build verification:

```bash
turbo build
```

## Deployment

### Production Stack
- Vercel
- Neon PostgreSQL
- Prisma ORM

### Environment Variables

`DATABASE_URL`  
`NEXTAUTH_SECRET`  
`JWT_SECRET`  
`PASSWORD`  
`NEXTAUTH_URL`  
`SKIP_ENV_VALIDATION`

### Deployment URLs

Storefront:
https://comp3036-2026-major-assignment-store-englinalong-raflq4e44.vercel.app/

Admin:
https://comp3036-2026-major-assignment-store-englinalong-ap8bu6j37.vercel.app/

