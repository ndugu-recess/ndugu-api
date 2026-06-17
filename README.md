# FarmConnect Backend

FarmConnect Backend is a Node.js, Express, and MariaDB/MySQL API for an agricultural marketplace. Farmers can publish produce listings, buyers can send inquiries and order requests, and admins can manage users, products, orders, and categories.

## Tech Stack

- Node.js and Express.js
- MariaDB/MySQL with `mysql2`
- JWT authentication with `jsonwebtoken`
- Password hashing with `bcrypt`
- Image uploads with `multer`
- Environment variables with `dotenv`

## Folder Structure

- `config/db.js`: Creates the MariaDB/MySQL connection pool.
- `controllers/`: Holds request logic for auth, products, orders, inquiries, profiles, admin tools, and categories.
- `middleware/`: Holds JWT authentication, role checks, and image upload setup.
- `routes/`: Defines API endpoint URLs and attaches middleware/controllers.
- `uploads/`: Stores product images uploaded through Multer.
- `database/schema.sql`: Creates all database tables.
- `database/seed.sql`: Adds sample users, profiles, categories, products, orders, and inquiries.
- `server.js`: Starts Express and registers all route groups.

## Database Setup

1. Create and load the schema:

```bash
mysql -u root -p < database/schema.sql
```

2. Load sample data:

```bash
mysql -u root -p farmconnect < database/seed.sql
```

3. Copy `.env.example` to `.env` and update the database credentials:

```bash
cp .env.example .env
```

## Environment Variables

- `PORT`: Express server port, default `5000`.
- `DB_HOST`: Database host, usually `localhost`.
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Database name, default `farmconnect`.
- `JWT_SECRET`: Secret key used to sign JWTs.
- `JWT_EXPIRES_IN`: Token lifetime, for example `1d`.
- `CLIENT_URL`: Frontend URL allowed by CORS.

## Run the Backend

```bash
npm install
npm run dev
```

For production-style startup:

```bash
npm start
```

## Default Login Accounts

All seeded accounts use the password `password123`.

- Admin: `admin@farmconnect.test`
- Farmer: `farmer1@farmconnect.test`
- Buyer: `buyer1@farmconnect.test`

## JWT Authentication

When a user logs in, the API returns a JWT. The frontend stores that token in `localStorage` and sends it in the `Authorization` header as `Bearer <token>`. The `authMiddleware` verifies the token and attaches the decoded user to `req.user`.

## Role-Based Access Control

The `roleMiddleware` checks `req.user.role`. For example, product creation allows only farmers, while admin routes allow only admins. Controllers still perform ownership checks so farmers can edit only their own listings.

## Image Uploads

Product image uploads use Multer in `middleware/uploadMiddleware.js`. Images are saved in `uploads/`, and Express serves them publicly at `/uploads/<filename>`. The frontend sends product forms as `multipart/form-data`.

## API Documentation

### Auth

- `POST /api/auth/register`: Register a farmer or buyer.
- `POST /api/auth/login`: Login and receive a JWT.
- `GET /api/auth/me`: Get the logged-in user.

### Products

- `GET /api/products`: Browse available products. Supports `name`, `category_id`, `district`, `min_price`, `max_price`, and `min_quantity`.
- `GET /api/products/:id`: Get one product.
- `POST /api/products`: Farmer creates a product. Protected.
- `PUT /api/products/:id`: Farmer edits own product. Protected.
- `DELETE /api/products/:id`: Farmer or admin removes a listing. Protected.
- `GET /api/products/farmer/my-products`: Farmer views own listings. Protected.

### Orders

- `POST /api/orders`: Buyer sends an order request. Protected.
- `GET /api/orders/my-orders`: Buyer views own orders. Protected.
- `GET /api/orders/farmer`: Farmer views orders for own products. Protected.
- `PUT /api/orders/:id/status`: Farmer/admin updates order status. Protected.

### Inquiries

- `POST /api/inquiries`: Buyer sends an inquiry. Protected.
- `GET /api/inquiries/my-inquiries`: Buyer views own inquiries. Protected.
- `GET /api/inquiries/farmer`: Farmer views inquiries for own products. Protected.
- `PUT /api/inquiries/:id/status`: Farmer/admin updates inquiry status. Protected.

### Profiles

- `GET /api/profile`: Get current user profile.
- `PUT /api/profile/farmer`: Create/update farmer profile.
- `PUT /api/profile/buyer`: Create/update buyer profile.

### Categories

- `GET /api/categories`: List active categories.
- `POST /api/categories`: Admin creates a category.
- `PUT /api/categories/:id`: Admin updates a category.

### Admin

- `GET /api/admin/stats`: Basic system statistics.
- `GET /api/admin/users`: List all users.
- `GET /api/admin/products`: List all products.
- `GET /api/admin/orders`: List all orders.
- `PUT /api/admin/users/:id/status`: Activate or deactivate a user.
