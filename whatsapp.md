# WhatsApp Business Integration Plan (Raley's Market)

This document outlines the technical strategy for integrating WhatsApp functionality specifically for the Raley's Market storefront (Port 8004). 

The integration covers two main objectives:
1. **Real-time Order Notifications**: Alerting the store owner via WhatsApp when a new order is placed.
2. **Catalog Synchronization**: Automatically syncing products from the Medusa database to the WhatsApp Business Catalog.

> [!IMPORTANT]
> **Tenant Isolation**
> Because this is a multi-tenant platform, all WhatsApp integrations must be scoped strictly to Raley's Market. We will use the `sales_channel_id` (`sc_01KPWFGEPT0CF83K2Q3GB7BWDD`) to ensure data and notifications do not bleed over into the other 4 storefronts.

## Open Questions for Store Owner

> [!WARNING]
> 1. **API Provider**: Do you prefer using **Meta's Official WhatsApp Cloud API** (free tier, but requires setting up a Meta Developer account and app approval) or a third-party provider like **Twilio** (easier setup, but incurs per-message costs)?
> 2. **Store Owner Number**: What is the verified WhatsApp Business phone number where the order notifications should be sent?
> 3. **Hosting/URLs**: To sync the catalog, Meta requires a publicly accessible URL. Is this platform currently hosted on a public domain, or are we testing via a tool like ngrok locally?

---

## Proposed Architecture

### 1. Order Notifications (Checkout to WhatsApp)

When a customer completes a checkout on port 8004, the Medusa backend will trigger an event. We will capture this event and send a formatted message to the store owner.

**Implementation Steps:**
1. **Create a Medusa Subscriber**: In the `apps/backend/src/subscribers` directory, we will create an `order-notifier.ts` subscriber listening for the `order.placed` event.
2. **Tenant Filtering**: The subscriber will check the order's `sales_channel_id`. If it matches Raley's Market, it proceeds; otherwise, it ignores the event.
3. **API Integration**:
   * We will integrate the chosen WhatsApp API (Meta Cloud or Twilio).
   * The payload will include: Order ID, Customer Name, Total Amount (in AED), and a list of items purchased.
4. **Environment Variables**: Add `WHATSAPP_API_KEY` and `STORE_OWNER_PHONE` to the backend `.env`.

### 2. Catalog Synchronization (Medusa DB to WhatsApp)

Yes, exporting products from our DB to WhatsApp is fully possible and highly recommended. WhatsApp Business Catalogs are powered by **Meta Commerce Manager**. We will generate an automated "Data Feed" that Meta can fetch continuously.

**Implementation Steps:**
1. **Create a Custom API Route**: In the Medusa backend, we will create a new endpoint: `GET /store/whatsapp-feed/raleys`.
2. **Data Formatting**: This endpoint will fetch all products associated with Raley's Market's `sales_channel_id` and map them to Meta's required CSV format. Required fields include:
   * `id` (Medusa Product ID)
   * `title` (Product Name)
   * `description`
   * `availability` (in stock)
   * `condition` (new)
   * `price` (Formatted with AED currency)
   * `link` (The product URL on `http://localhost:8004/products/[handle]`)
   * `image_link` (Product Thumbnail)
3. **Integration with Meta**:
   * You will log into Meta Commerce Manager.
   * Add a new "Data Source" > "Data Feed".
   * Provide the URL of our new API endpoint and set it to sync hourly.
   * Finally, link this Catalog to your WhatsApp Business Account.

---

## Verification Plan

### Automated Tests
- Trigger test orders in the local environment and verify the subscriber fires and the API request is logged.
- Validate the CSV output of the `/store/whatsapp-feed/raleys` endpoint against Meta's Feed Debugger tool.

### Manual Verification
- **Notifications**: Place an order on `http://localhost:8004` and confirm the WhatsApp message is received on the designated phone number.
- **Catalog**: Confirm that products appear in the WhatsApp Business app catalog tab after the initial Commerce Manager sync.

---

## API Requirements Checklist (For Management)

To go live with the Order Notifications, please acquire the following credentials and add them to the `apps/backend/.env` file:

**Option A: Meta Cloud API (Recommended / Free Tier)**
1. **Meta Developer App**: Created at developers.facebook.com
2. **System User Access Token**: The permanent API key. (`WHATSAPP_API_KEY`)
3. **Phone Number ID**: The Meta ID for the sending number.
4. **Verified Receiving Number**: The Store Owner's WhatsApp number with country code. (`WHATSAPP_STORE_OWNER_NUMBER`)

**Option B: Twilio (Alternative)**
1. **Account SID**: Twilio Account ID.
2. **Auth Token**: Twilio Secret Token. (`WHATSAPP_API_KEY`)
3. **Sender Number**: Twilio WhatsApp Number.
4. **Receiving Number**: Store Owner's WhatsApp number. (`WHATSAPP_STORE_OWNER_NUMBER`)
