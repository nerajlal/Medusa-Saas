# 🌐 Custom Domain Setup Playbook

Use this guide to connect external domains (e.g., from GoDaddy, Namecheap) to your Medusa Multi-Tenant SaaS stores.

---

## Step 1: DNS Configuration (GoDaddy Side)

Log in to your domain registrar (GoDaddy) and navigate to the **DNS Management** section for your domain.

### 1. Point the Root Domain
Add an **A Record** to point your main domain to your Medusa server.
- **Type**: `A`
- **Name/Host**: `@`
- **Value**: `[YOUR_SERVER_IP_ADDRESS]`
- **TTL**: `1 Hour` (or default)

### 2. Point the WWW Subdomain
Add a **CNAME Record** so that `www.yourstore.com` also works.
- **Type**: `CNAME`
- **Name/Host**: `www`
- **Value**: `@`
- **TTL**: `1 Hour` (or default)

---

## Step 2: Medusa Engine Mapping (Master Admin Side)

Once the DNS is set, you must tell your Medusa Engine which store belongs to that domain.

1.  Open your **Master Admin Dashboard** (`http://localhost:3000`).
2.  Click on **+ Add New Store** (or edit an existing one).
3.  In the **Custom Domain** field, enter your domain **without** `http://` (e.g., `www.mystore.com` or `mystore.com`).
4.  Click **Create/Update Store**.

---

## 🛠️ How it Works (Technical)

Your Medusa Engine uses a **Global Middleware** layer that performs a high-speed lookup on every request.

1.  A customer visits `www.nike-store.in`.
2.  The traffic hits your server IP.
3.  The Middleware reads the `Host` header (`www.nike-store.in`).
4.  It queries the `store_settings` table:
    ```sql
    SELECT tenant_id FROM store_settings WHERE custom_domain = 'www.nike-store.in'
    ```
5.  If found, it instantly locks the database session to that specific **Tenant ID**, ensuring the customer only sees products, orders, and prices for that specific store.

---

> [!TIP]
> **SSL/HTTPS**: If you are using a reverse proxy like Nginx or Caddy, ensure you enable SSL (Let's Encrypt) so your store owners' domains are secure (`https://`).
