# Medusa SaaS Local Development Guide

## 🚀 Quick Start Sequence

To avoid "Failed to fetch" errors, services should be started in this order:

1. **Start the Backend** (Foundational API)
2. **Start the Superadmin** (Management Console)
3. **Start Storefronts** (Customer View)

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
Example for Choco Bliss (Theme D):
- **Path:** `apps/storefront-cho`
- **Command:** `npm run dev`
- **URL:** `http://localhost:8003`

## Store Owner Credentials

You can log into the Medusa Admin (`http://localhost:9000/app`) using any of the following tenant owner accounts. All accounts share the same password.

**Global Password:** `supersecret`

| Store Name | Tenant ID | Admin Email |
| :--- | :--- | :--- |
| Choco Bliss | `choco-bliss` | `choco@test.com` |
| Raley's Market | `raleys-market` | `owner@raleys.com` |
| Nike Official Store | `nike-shop` | `nike@test.com` |
| Apple Premium Reseller | `apple-premium` | `apple@test.com` |
| Adidas High-Conv | `adidas-boost` | `adidas@test.com` |

## Tenant Isolation (Multi-Tenancy)
- Each owner account is strictly tied to their respective `tenant_id` via Medusa user metadata mapping.
- Products, orders, and configuration created by one tenant in the admin dashboard will not be visible to other tenants.
