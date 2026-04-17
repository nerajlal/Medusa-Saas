# Medusa SaaS Local Development Guide

## Running Services

1. **Frontend Superadmin**
   - URL: `http://localhost:3000`
   - Purpose: Master management console to view and create tenants/stores.

2. **Choco Bliss Storefront (Theme D)**
   - URL: `http://localhost:8003`
   - Purpose: The customer-facing frontend for the Choco Bliss tenant.

3. **Medusa Admin Backend**
   - URL: `http://localhost:9000/app`
   - API: `http://localhost:9000`
   - Purpose: Unified backend and admin dashboard for all store owners.

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
