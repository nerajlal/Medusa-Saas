const http = require('http');

const data = JSON.stringify({
  tenant_id: 'adidas_tenant',
  store_name: 'Adidas Store',
  admin_email: 'adidas@test.com',
  admin_password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 9000,
  path: '/admin/tenants',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
