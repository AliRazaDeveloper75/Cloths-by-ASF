# Cloth by AFS — Setup Guide

## Project Structure

```
Cloth by AFS/
├── backend/          # Django + DRF API
├── frontend/         # React + Tailwind store + admin
├── docker-compose.yml
└── SETUP.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials, secret key, etc.

# Create PostgreSQL database
psql -U postgres
CREATE DATABASE cloth_by_afs;
\q

# Run migrations
python manage.py migrate

# Seed sample data (creates admin, products, categories, coupons)
python manage.py seed_data

# Run development server
python manage.py runserver
```

Backend runs on: http://localhost:8000
API docs: http://localhost:8000/api/docs/

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed (defaults work for local dev)

# Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

---

### 3. Default Credentials

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@clothbyafs.com    | Admin@1234  |
| Customer | customer@test.com        | Test@1234   |

Admin dashboard: http://localhost:5173/admin

---

### 4. Sample Coupons

| Code       | Discount                        |
|------------|---------------------------------|
| WELCOME10  | 10% off (min order PKR 1,000)  |
| SAVE500    | PKR 500 off (min order PKR 3,000) |

---

## 🐳 Docker Deployment

```bash
# Copy and configure env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Build and start all services
docker-compose up --build -d

# Run migrations in container
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

Application runs on: http://localhost:80

---

## 🔧 Environment Variables

### Backend (.env)
| Variable                    | Description                    | Default              |
|-----------------------------|--------------------------------|----------------------|
| SECRET_KEY                  | Django secret key              | Required             |
| DEBUG                       | Debug mode                     | False                |
| DB_NAME                     | PostgreSQL database name       | cloth_by_afs         |
| DB_USER                     | PostgreSQL username            | postgres             |
| DB_PASSWORD                 | PostgreSQL password            | Required             |
| DB_HOST                     | PostgreSQL host                | localhost            |
| CORS_ALLOWED_ORIGINS        | Comma-separated allowed origins | http://localhost:5173 |
| EMAIL_HOST_USER             | SMTP email address             | Optional             |
| EMAIL_HOST_PASSWORD         | SMTP app password              | Optional             |
| STRIPE_SECRET_KEY           | Stripe secret key              | Optional             |
| FRONTEND_URL                | Frontend URL for email links   | http://localhost:5173 |

### Frontend (.env)
| Variable               | Description              | Default                       |
|------------------------|--------------------------|-------------------------------|
| VITE_API_URL           | Backend API URL          | http://localhost:8000/api/v1  |
| VITE_MEDIA_URL         | Media files base URL     | http://localhost:8000         |
| VITE_STRIPE_PUBLIC_KEY | Stripe publishable key   | Optional                      |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint                        | Description              | Auth     |
|--------|---------------------------------|--------------------------|----------|
| POST   | /api/v1/auth/register/          | Register new user        | Public   |
| POST   | /api/v1/auth/login/             | Login (get JWT tokens)   | Public   |
| POST   | /api/v1/auth/logout/            | Logout (blacklist token) | Required |
| GET    | /api/v1/auth/profile/           | Get user profile         | Required |
| PATCH  | /api/v1/auth/profile/           | Update profile           | Required |
| POST   | /api/v1/auth/change-password/   | Change password          | Required |
| POST   | /api/v1/auth/password-reset/    | Request password reset   | Public   |
| POST   | /api/v1/auth/token/refresh/     | Refresh JWT token        | Public   |

### Products
| Method | Endpoint                            | Description              | Auth     |
|--------|-------------------------------------|--------------------------|----------|
| GET    | /api/v1/products/                   | List products (filterable)| Public  |
| GET    | /api/v1/products/{slug}/            | Product detail           | Public   |
| GET    | /api/v1/products/featured/          | Featured products        | Public   |
| GET    | /api/v1/products/categories/        | Category tree            | Public   |

**Query Parameters for product list:**
- `search` — full-text search
- `category` — category slug
- `min_price`, `max_price` — price range
- `in_stock` — true/false
- `is_featured` — true/false
- `ordering` — price, -price, -created_at, name

### Cart
| Method | Endpoint                       | Description        | Auth     |
|--------|--------------------------------|--------------------|----------|
| GET    | /api/v1/cart/                  | Get cart           | Required |
| POST   | /api/v1/cart/                  | Add item to cart   | Required |
| DELETE | /api/v1/cart/                  | Clear cart         | Required |
| PATCH  | /api/v1/cart/items/{id}/       | Update item qty    | Required |
| DELETE | /api/v1/cart/items/{id}/       | Remove item        | Required |

### Orders
| Method | Endpoint                       | Description        | Auth     |
|--------|--------------------------------|--------------------|----------|
| GET    | /api/v1/orders/                | List my orders     | Required |
| POST   | /api/v1/orders/place/          | Place new order    | Required |
| GET    | /api/v1/orders/{id}/           | Order detail       | Required |
| POST   | /api/v1/orders/{id}/cancel/    | Cancel order       | Required |

### Admin
All admin endpoints require `role=admin`.
- `/api/v1/products/admin/products/` — Product CRUD
- `/api/v1/products/admin/categories/` — Category CRUD
- `/api/v1/orders/admin/orders/` — All orders
- `/api/v1/orders/admin/dashboard/` — Dashboard stats
- `/api/v1/auth/admin/users/` — User management
- `/api/v1/coupons/admin/coupons/` — Coupon CRUD

---

## 🌐 Production Deployment (Ubuntu/VPS)

```bash
# 1. Server setup
sudo apt update && sudo apt install -y python3-pip nginx postgresql

# 2. Clone and configure
git clone <your-repo>
cd "Cloth by AFS"

# 3. Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # Edit with production values
export DJANGO_SETTINGS_MODULE=config.settings.production
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_data

# Run with gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --daemon

# 4. Frontend
cd ../frontend
npm ci
npm run build
# Copy dist/ to /var/www/html/

# 5. Nginx config (see frontend/nginx.conf)
# Point server_name to your domain
# Point /api/ proxy to gunicorn
```

---

## 🗄️ Database Schema Overview

| Table              | Key Fields                                          |
|--------------------|-----------------------------------------------------|
| users              | email, first_name, last_name, role, is_blocked      |
| shipping_addresses | user, full_name, address, city, country             |
| categories         | name, slug, parent, is_active                       |
| products           | name, slug, category, price, discount_price, stock  |
| product_images     | product, image, is_primary                          |
| product_variants   | product, name, value, stock                         |
| carts              | user (OneToOne)                                     |
| cart_items         | cart, product, variant, quantity                    |
| wishlists          | user (OneToOne), products (M2M)                     |
| orders             | user, status, payment_method, total, shipping_*     |
| order_items        | order, product, product_name (snapshot), quantity   |
| payments           | order, amount, status, stripe_payment_intent        |
| coupons            | code, discount_type, discount_value, valid_until    |
| reviews            | product, user, rating, comment, is_approved         |
