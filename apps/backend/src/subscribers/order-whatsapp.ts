import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/framework"
import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function orderWhatsappSubscriber({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService: IOrderModuleService = container.resolve(Modules.ORDER)
  
  // Fetch order details including relations
  const order = await orderService.retrieveOrder(data.id, {
    relations: ["items", "shipping_address", "customer"],
  })

  // IMPORTANT: Isolate this to Raley's Market only
  const RALEYS_SALES_CHANNEL_ID = "sc_01KPWFGEPT0CF83K2Q3GB7BWDD"
  if (order.sales_channel_id !== RALEYS_SALES_CHANNEL_ID) {
    return // Skip orders from other storefronts
  }

  const itemsList = order.items?.map(i => `${i.quantity}x ${i.title}`).join('\n') || "No items"
  const total = order.total ? (Number(order.total) / 100).toFixed(2) : "0.00"

  const message = `*New Order Alert! (Raley's Market)* 🛒\n\n` +
    `*Order ID:* ${order.display_id || order.id}\n` +
    `*Customer:* ${(order as any).customer?.first_name || 'Guest'} ${(order as any).customer?.last_name || ''}\n` +
    `*Total:* INR ${total}\n\n` +
    `*Items:*\n${itemsList}\n\n` +
    `*Source:* http://localhost:8004`

  const storeOwnerNumber = process.env.WHATSAPP_STORE_OWNER_NUMBER
  const apiKey = process.env.WHATSAPP_API_KEY
  
  console.log(`\n======================================`)
  console.log(`[WhatsApp Sync] New Order Received!`)
  console.log(`Sending notification to store owner...`)
  console.log(`--------------------------------------`)
  console.log(message)
  console.log(`======================================\n`)

  if (storeOwnerNumber && apiKey) {
    try {
      console.log(`[WhatsApp Sync] Executing API Call to Meta...`)
      /*
      // Meta Cloud API Implementation Template
      await fetch(`https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: storeOwnerNumber,
          type: "text",
          text: { body: message },
        }),
      })
      */
    } catch (e) {
      console.error("[WhatsApp Sync] Failed to send message:", e)
    }
  } else {
    console.log(`[WhatsApp Sync] WHATSAPP_STORE_OWNER_NUMBER or WHATSAPP_API_KEY not set in .env. Skipping actual API call.`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
