const axios = require('axios');

async function testAddToCart() {
  const BACKEND_URL = "http://localhost:9000";
  const PUBLISHABLE_KEY = "pk_651b4c2c09454729b198e480b85c934d479d32cdf5237d5bc06d113a83c906e9";
  const REGION_ID = "reg_01KP3CJE8SN60VB07DQ9YVDWB7";
  
  const tests = [
    { tenant: 'nike-shop', name: 'Nike A (Minimal)', sc: 'sc_01KP2MG6HJZQ3Z0XYTY5X9BPEY' },
    { tenant: 'apple-premium', name: 'Apple B (Premium)', sc: 'sc_01KP2MG6HJZWD56VSR46J3P64J' },
    { tenant: 'adidas-boost', name: 'Adidas C (High-Conv)', sc: 'sc_01KP2MG6HKV42267V6B593BG2B' },
    { tenant: 'choco-bliss', name: 'Choco D', sc: 'sc_choco_dxn23' },
    { tenant: 'raleys-market', name: 'Marketplace', sc: 'sc_01KPWFGEPT0CF83K2Q3GB7BWDD' }
  ];

  for (const t of tests) {
    console.log(`\n--- Testing ${t.name} (${t.tenant}) ---`);
    try {
      // 1. Get products to find a variant
      const prodRes = await axios.get(`${BACKEND_URL}/store/products?sales_channel_id=${t.sc}`, {
        headers: { "x-publishable-api-key": PUBLISHABLE_KEY, "x-tenant-id": t.tenant }
      });
      
      const product = prodRes.data.products?.[0];
      if (!product) {
        console.log(`  ❌ No products found for channel ${t.sc}`);
        continue;
      }
      
      const variantId = product.variants?.[0]?.id;
      if (!variantId) {
        console.log(`  ❌ No variant found for product ${product.title}`);
        continue;
      }
      
      console.log(`  Found variant: ${variantId} for ${product.title}`);

      // 2. Create Cart
      const cartRes = await axios.post(`${BACKEND_URL}/store/carts`, {
        sales_channel_id: t.sc,
        region_id: REGION_ID
      }, {
        headers: { "x-publishable-api-key": PUBLISHABLE_KEY, "x-tenant-id": t.tenant }
      });
      
      const cartId = cartRes.data.cart.id;
      console.log(`  Cart created: ${cartId}`);

      // 3. Add to Cart
      const addRes = await axios.post(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
        variant_id: variantId,
        quantity: 1
      }, {
        headers: { "x-publishable-api-key": PUBLISHABLE_KEY, "x-tenant-id": t.tenant }
      });
      
      console.log(`  ✅ Successfully added to cart!`);
    } catch (e) {
      console.log(`  ❌ FAILED: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
    }
  }
}

testAddToCart();
