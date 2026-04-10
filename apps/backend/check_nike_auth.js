const crypto = require('crypto');
const util = require('util');

// Medusa scrypt implementation uses roughly this format, but let's just 
// use medusa's internal package if possible, or we can just tell them.
async function getHash() {
    // Or we can just spin up the medusa container to register a temp user, extract the hash, then delete it.
    // Let's use the Medusa DI container to use the EmailPass provider's register method, or manually hash.
    // Let's just create a test token to see.
}
