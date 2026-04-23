const http = require('http');

const storefronts = [
  { port: 8001, name: 'Nike A (Minimal)', tenant: 'nike-shop' },
  { port: 8002, name: 'Apple B (Premium)', tenant: 'apple-premium' },
  { port: 8003, name: 'Choco D', tenant: 'choco-bliss' },
  { port: 8004, name: 'Marketplace', tenant: 'raleys-market' },
  { port: 8005, name: 'Adidas C', tenant: 'adidas-boost' },
];

async function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length }));
    });
    req.on('error', (e) => resolve({ status: 'ERROR', error: e.message }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ status: 'TIMEOUT' }); });
  });
}

async function main() {
  console.log('=== Storefront Health Check ===\n');
  for (const sf of storefronts) {
    const result = await checkPort(sf.port);
    if (result.status === 200) {
      console.log(`  ✅ ${sf.name} (localhost:${sf.port}) - OK (${result.length} bytes)`);
    } else {
      console.log(`  ❌ ${sf.name} (localhost:${sf.port}) - ${result.status} ${result.error || ''}`);
    }
  }
  
  // Also check backend
  const backend = await checkPort(9000);
  console.log(`\n  🔧 Backend (localhost:9000) - ${backend.status === 200 || backend.status === 302 ? '✅ OK' : backend.status}`);
}

main();
