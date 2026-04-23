# Medusa SaaS Local Development Guide

## 🚀 Quick Start Sequence

To avoid "Failed to fetch" errors, services should be started in this order:

1. **Start the Backend** (Foundational API)
2. **Start the Superadmin** (Management Console)
3. **Start Storefronts** (Customer View) - Port Range: 8000-8004

---

## 🛠 Running Services

### 1. Medusa Backend (CRITICAL)
The core API that powers everything. **Must be running** for the Superadmin and Storefronts to work.
- **Path:** `apps/backend`
- **Command:** `npm run dev`
- **URL:** `http://localhost:9000/app` (Admin Dashboard)
- **API:** `http://localhost:9000`

### 2. Frontend Superadmin
The master console to manage tenants/stores.
- **Path:** `apps/master-admin`
- **Command:** `npm run dev`
- **URL:** `http://localhost:3000`
- **Note:** Depends on Backend (Port 9000).

### 3. Storefronts (Multi-Tenant)

| Theme | Store Name | Path | Command | URL |
| :--- | :--- | :--- | :--- | :--- |
| **Theme C** | Adidas High-Conv | `apps/storefront-c` | `npm run dev -- -p 8000` | `http://localhost:8000` |
| **Theme A** | Nike Official Store | `apps/storefront-a` | `npm run dev -- -p 8001` | `http://localhost:8001` |
| **Theme B** | Apple Premium Reseller | `apps/storefront-b` | `npm run dev -- -p 8002` | `http://localhost:8002` |
| **Theme D** | Choco Bliss | `apps/storefront-cho` | `npm run dev -- -p 8003` | `http://localhost:8003` |
| **Theme E** | Raley's Market | `apps/storefront-market` | `npm run dev -- -p 8004` | `http://localhost:8004` |

## Store Owner Credentials

You can log into the Medusa Admin (`http://localhost:9000/app`) using any of the following tenant owner accounts. All accounts share the same password.

**Global Password:** `supersecret`

| Store Name | Tenant ID | Admin Email |url
| :--- | :--- | :--- |
| Choco Bliss | `choco-bliss` | `choco@test.com` | http://localhost:8003
| Raley's Market | `raleys-market` | `owner@raleys.com` | http://localhost:8004
| Nike Official Store | `nike-shop` | `nike@test.com` | http://localhost:8001
| Apple Premium Reseller | `apple-premium` | `apple@test.com` | http://localhost:8002
| Adidas High-Conv | `adidas-boost` | `adidas@test.com` | http://localhost:8000

## Tenant Isolation (Multi-Tenancy)
- Each owner account is strictly tied to their respective `tenant_id` via Medusa user metadata mapping.
- Products, orders, and configuration created by one tenant in the admin dashboard will not be visible to other tenants.
