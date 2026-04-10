const http = require('http');

const tenants = [
    { 
        tenant_id: 'nike-shop', 
        store_name: 'Nike Official Store', 
        admin_email: 'nike@test.com', 
        admin_password: 'password',
        theme: 'A'
    },
    { 
        tenant_id: 'apple-premium', 
        store_name: 'Apple Premium Reseller', 
        admin_email: 'apple@test.com', 
        admin_password: 'password',
        theme: 'B'
    },
    { 
        tenant_id: 'adidas-boost', 
        store_name: 'Adidas High-Conv', 
        admin_email: 'adidas@test.com', 
        admin_password: 'password',
        theme: 'C'
    }
];

async function seed() {
    for (const t of tenants) {
        console.log(`Sending request for ${t.tenant_id}...`);
        
        await new Promise((resolve, reject) => {
            const req = http.request({
                hostname: 'localhost',
                port: 9000,
                path: '/admin/tenants',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, (res) => {
                let body = '';
                res.on('data', d => body += d);
                res.on('end', () => {
                    console.log(`Status ${res.statusCode}: ${body}`);
                    resolve();
                });
            });

            req.on('error', (e) => {
                console.error(e);
                reject(e);
            });

            req.write(JSON.stringify(t));
            req.end();
        });
    }
}

seed().then(() => console.log('Done!'));
