# API Documentation

The Full Stack Store uses a REST-style API to support customer accounts, authentication, product management, and order management features. This documentation is based only on the API routes and behavior that are currently implemented in the codebase.

## Customer Order List

**Endpoint:** /api/orders

**Method:** GET

**Purpose**
Returns the logged-in customer's order history.

### Authentication

Customer login is required.

### Request Parameters

No request parameters.

### Request Body

```json
{}
```

### Success Response

```json
{
  "orders": [
    {
      "databaseId": 1,
      "id": "ORD-1",
      "date": "2026-05-31T00:00:00.000Z",
      "status": "Paid",
      "total": "$89.00",
      "itemCount": 1,
      "items": [
        {
          "id": 1,
          "urlId": "react-dashboard-ui-kit",
          "title": "React Dashboard UI Kit",
          "category": "React",
          "price": "$89.00",
          "quantity": 1,
          "href": "/product/react-dashboard-ui-kit"
        }
      ],
      "shipping": {
        "fullName": "",
        "email": "customer@example.com",
        "address": "",
        "city": "",
        "postalCode": ""
      },
      "payment": {
        "cardholderName": "",
        "last4": ""
      }
    }
  ]
}
```

### Error Response

```json
{
  "error": "Unauthorized"
}
```

### Limitations / Constraints

- The customer must be logged in.
- Only orders belonging to the logged-in customer are returned.
- The route checks both the session user and the stored email address.

## Create Customer Order

**Endpoint:** /api/orders

**Method:** POST

**Purpose**
Creates a new customer order from the items in the cart.

### Authentication

Customer login is required.

### Request Parameters

No URL parameters.

### Request Body

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

### Success Response

```json
{
  "success": true,
  "order": {
    "databaseId": 1,
    "id": "ORD-1",
    "date": "2026-05-31T00:00:00.000Z",
    "status": "Paid",
    "total": "$178.00",
    "itemCount": 2,
    "items": [
      {
        "id": 1,
        "urlId": "react-dashboard-ui-kit",
        "title": "React Dashboard UI Kit",
        "category": "React",
        "price": "$89.00",
        "quantity": 2,
        "href": "/product/react-dashboard-ui-kit"
      }
    ],
    "shipping": {
      "fullName": "",
      "email": "customer@example.com",
      "address": "",
      "city": "",
      "postalCode": ""
    },
    "payment": {
      "cardholderName": "",
      "last4": ""
    }
  }
}
```

### Error Response

```json
{
  "error": "One or more selected products are unavailable."
}
```

### Limitations / Constraints

- The customer must be logged in.
- `items` must be a non-empty array.
- `productId` must be a positive integer.
- `quantity` must be an integer of at least 1.
- Duplicate product IDs are combined before the order is created.
- Products must exist, be active, and have enough stock.
- New orders are created with the status `Paid`.

## Customer Registration

**Endpoint:** /api/account/register

**Method:** POST

**Purpose**
Creates a new customer account.

### Authentication

No login is required.

### Request Parameters

No request parameters.

### Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "mypassword123"
}
```

### Success Response

```json
{
  "success": true,
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2026-05-31T00:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "error": "An account with this email already exists. Please log in."
}
```

### Limitations / Constraints

- `name`, `email`, and `password` are required.
- Email addresses are normalized to lowercase.
- Email must be in a valid format.
- Password must be at least 8 characters long.
- Duplicate email addresses are not allowed.

## Customer Authentication

**Endpoint:** /api/auth/[...nextauth]

**Method:** GET / POST

**Purpose**
Handles customer sign-in, session handling, and sign-out for the storefront using NextAuth.

### Authentication

No login is required to access the sign-in flow, but a valid customer account is required to log in successfully.

### Request Parameters

This is a catch-all authentication route managed by NextAuth. The codebase verifies credential-based login using email and password.

### Request Body

```json
{
  "email": "jane@example.com",
  "password": "mypassword123"
}
```

### Success Response

```json
{
  "note": "The route uses NextAuth. The project verifies that customer login uses email and password credentials and creates a JWT session."
}
```

### Error Response

```json
{
  "note": "If the email or password is incorrect, the sign-in attempt fails."
}
```

### Limitations / Constraints

- This route is framework-managed by NextAuth.
- The verified provider is a credentials provider.
- Login checks the `User` table using email and password.
- Passwords are checked using bcrypt.
- Session data includes `id`, `name`, `email`, `role`, and `createdAt`.

## Disabled Seed Endpoint

**Endpoint:** /api/seed

**Method:** GET

**Purpose**
This endpoint exists in the project, but it is currently disabled.

### Authentication

No login is required.

### Request Parameters

No request parameters.

### Request Body

```json
{}
```

### Success Response

```json
{
  "message": "Not Available"
}
```

### Error Response

```json
{
  "message": "Not Available"
}
```

### Limitations / Constraints

- This route returns HTTP status `501`.
- It does not perform any seeding.

## Admin Login

**Endpoint:** /api/auth

**Method:** POST

**Purpose**
Logs an admin user in and creates an admin authentication cookie.

### Authentication

No existing login is required.

### Request Parameters

No request parameters.

### Request Body

```json
{
  "password": "admin-password"
}
```

### Success Response

```json
{
  "success": true
}
```

### Error Response

```json
{
  "error": "Invalid password"
}
```

### Limitations / Constraints

- This route uses a single admin password from environment configuration.
- It does not use a database-backed admin account.
- On success, it sets an `auth_token` cookie.

## Admin Logout

**Endpoint:** /api/auth

**Method:** DELETE

**Purpose**
Logs the admin user out by clearing the admin authentication cookie.

### Authentication

No separate login check is performed in this route.

### Request Parameters

No request parameters.

### Request Body

```json
{}
```

### Success Response

```json
{
  "success": true
}
```

### Error Response

```json
{
  "message": "No custom error response is defined for this route."
}
```

### Limitations / Constraints

- This route clears the `auth_token` cookie.

## Legacy Admin Login

**Endpoint:** /api/auth/login

**Method:** POST

**Purpose**
Provides a legacy admin login endpoint kept for compatibility.

### Authentication

No existing login is required.

### Request Parameters

No request parameters.

### Request Body

```json
{
  "password": "admin-password"
}
```

### Success Response

```json
{
  "success": true
}
```

### Error Response

```json
{
  "error": "Invalid password"
}
```

### Limitations / Constraints

- This route is marked in the code as a legacy compatibility endpoint.
- It sets an `auth_token` cookie after successful login.

## Legacy Admin Logout Redirect

**Endpoint:** /api/auth/logout

**Method:** GET

**Purpose**
Logs the admin user out and redirects the browser back to the home page.

### Authentication

No separate login check is performed in this route.

### Request Parameters

No request parameters.

### Request Body

```json
{}
```

### Success Response

```json
{
  "message": "Redirects to / after clearing auth cookies"
}
```

### Error Response

```json
{
  "message": "No custom error response is defined for this route."
}
```

### Limitations / Constraints

- This is a legacy logout endpoint.
- It clears both `auth_token` and `password` cookies.

## Legacy Admin Logout JSON

**Endpoint:** /api/auth/logout

**Method:** POST

**Purpose**
Logs the admin user out and returns a JSON success response.

### Authentication

No separate login check is performed in this route.

### Request Parameters

No request parameters.

### Request Body

```json
{}
```

### Success Response

```json
{
  "success": true
}
```

### Error Response

```json
{
  "message": "No custom error response is defined for this route."
}
```

### Limitations / Constraints

- This is a legacy logout endpoint.
- It clears both `auth_token` and `password` cookies.

## Create Product

**Endpoint:** /api/posts

**Method:** POST

**Purpose**
Creates a new product in the admin store management system.

### Authentication

Admin login is required.

### Request Parameters

No URL parameters.

### Request Body

```json
{
  "title": "React Dashboard UI Kit",
  "category": "React",
  "description": "A responsive dashboard template.",
  "content": "Full product details here.",
  "imageUrl": "https://example.com/product.jpg",
  "price": "89.00",
  "stockQuantity": "12",
  "tags": "Front-End, UI Design"
}
```

### Success Response

```json
{
  "success": true,
  "id": 1
}
```

### Error Response

```json
{
  "error": "Title is required"
}
```

### Limitations / Constraints

- Admin login is required.
- `title`, `category`, `description`, `content`, `imageUrl`, `price`, `stockQuantity`, and `tags` are all required.
- `description` must be 200 characters or fewer.
- `imageUrl` must be a valid URL.
- `price` must be a number greater than 0.
- `stockQuantity` must be a non-negative integer.
- New products are created with `active: true`.
- The product `urlId` is generated from the title.

## Update Product

**Endpoint:** /api/posts/[id]

**Method:** PATCH

**Purpose**
Updates an existing product in the admin system.

### Authentication

Admin login is required.

### Request Parameters

- Required path parameter: `id`

### Request Body

```json
{
  "title": "React Dashboard UI Kit",
  "category": "React",
  "description": "Updated product summary.",
  "content": "Updated product details.",
  "imageUrl": "https://example.com/product.jpg",
  "price": "89.00",
  "stockQuantity": "10",
  "tags": "Front-End, UI Design"
}
```

### Success Response

```json
{
  "success": true,
  "id": 1
}
```

### Error Response

```json
{
  "error": "Product not found"
}
```

### Limitations / Constraints

- Admin login is required.
- `id` must be a positive integer.
- The same validation rules as product creation are applied.
- If the product does not exist, the route returns `Product not found`.

## Toggle Product Active Status

**Endpoint:** /api/posts/[id]/active

**Method:** PATCH

**Purpose**
Changes whether a product is active or inactive.

### Authentication

Admin login is required.

### Request Parameters

- Required path parameter: `id`

### Request Body

```json
{
  "active": true
}
```

### Success Response

```json
{
  "id": 1,
  "active": true
}
```

### Error Response

```json
{
  "error": "Invalid active value"
}
```

### Limitations / Constraints

- Admin login is required.
- `id` must be a positive integer.
- `active` must be a boolean value.

## Update Order Status

**Endpoint:** /api/orders/[id]

**Method:** PATCH

**Purpose**
Updates the status of a customer order in the admin system.

### Authentication

Admin login is required.

### Request Parameters

- Required path parameter: `id`

### Request Body

```json
{
  "status": "Shipped"
}
```

### Success Response

```json
{
  "id": 1,
  "status": "Shipped"
}
```

### Error Response

```json
{
  "error": "Invalid order status"
}
```

### Limitations / Constraints

- Admin login is required.
- `id` must be a positive integer.
- Allowed order statuses are:
- `Paid`
- `Processing`
- `Shipped`
- `Cancelled`

## Known Limitations

- The storefront authentication route is managed by NextAuth, so some internal auth response details are handled by the framework.
- There is no API endpoint for deleting products.
- There is no API endpoint for updating or deleting customer account details.
- The `/api/seed` endpoint exists but is intentionally disabled.
- Admin authentication uses a single password and cookie, not a database-based admin user system.
