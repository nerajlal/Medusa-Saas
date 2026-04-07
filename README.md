# Medusa.js v2 Multi-Tenant SaaS Engine 🚀

A powerful, production-ready Multi-Tenant E-commerce SaaS boilerplate built on top of **Medusa.js v2**. 

This engine is architected for a **Shared Database, Shared Schema** model, utilizing **PostgreSQL Row-Level Security (RLS)** for absolute data isolation between tenants.

## 🏗️ Core Architecture

### 1. Data Isolation (RLS)
- **Shared DB, Shared Schema**: All tenants share the same database tables.
- **RLS Enforced**: Every core table (Products, Carts, Orders, etc.) is scoped via a `tenant_id` column.
- **Session-Based Filtering**: A custom middleware extracts `x-tenant-id` from headers and injects it into the Postgres session using `SET app.current_tenant_id`.

### 2. Multi-Theme Monorepo
The project is a monorepo containing three distinct Storefronts, each representing a unique brand identity:
- **Minima (Theme A)**: Minimalist, clean, modern.
- **Noir (Theme B)**: Premium, dark-mode, luxurious.
- **Convex (Theme C)**: High-conversion, grid-style, mobile-optimized.

### 3. Smart Payment Routing
- **Dynamic PhonePe Provider**: Credentials (Merchant ID & API Keys) are resolved dynamically from the database based on the active cart's `tenant_id`.
- **Encrypted Storage**: Merchant keys are stored with AES-256 encryption in the `StoreSettings` module.

### 4. Admin Orchestration
- **Master Dashboard**: A super-admin console to create tenants, assign themes, and manage global settings.
- **Bulk Product Orchestrator**: An Excel-based (.xlsx) bulk upload tool powered by **Medusa Workflows** with transactional safety.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v20+
- PostgreSQL
- Redis

### 2. Setup Monorepo
```bash
# Install root dependencies
npm install 

# Setup Environment Variables
# Create .env in apps/backend with:
# DATABASE_URL, REDIS_URL, JWT_SECRET, ENCRYPTION_KEY (32-char)
```

### 3. Initialize Database
```bash
cd apps/backend
npx medusa db:migrate

# Seed multi-tenant sample data (Tenants, Channels, Products)
npx medusa exec ./src/scripts/seed-tenants.ts
```

### 4. Run the Platform
```bash
# From root
npm run dev
```

- **Master Admin**: `http://localhost:3000`
- **Storefront A**: `http://localhost:3001`
- **Storefront B**: `http://localhost:3002`
- **Medusa Backend**: `http://localhost:9000`

---

## 🛠️ Technology Stack
- **Backend**: Medusa.js v2 (Modules, Workflows, RLS)
- **Frontend**: Next.js 15+, Tailwind CSS
- **Database**: PostgreSQL (Deeply integrated RLS)
- **Cache**: Redis
- **Storage**: Custom S3 Tenant-Aware Provider

## 🛡️ Security & Scalability
- **Encryption**: `StoreSettings` module handles sensitive merchant data using AES-256-CBC.
- **Concurrency**: High-performance transaction handling via Medusa v2 Modules.
- **File Isolation**: Per-tenant S3 path prefixing (`/tenant_id/images/...`).

---

## 📄 License
This project is licensed under the MIT License.
