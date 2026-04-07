import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'
import StoreSettingsModule from './src/modules/store-settings'
import TenantPaymentModule from './src/modules/tenant-payment'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },

  modules: [
    // ─── Custom: StoreSettings (tenant credentials & config) ────────────────
    {
      resolve: './src/modules/store-settings',
      key: 'storeSettings',
    },

    // ─── Custom: Dynamic PhonePe Payment Provider ────────────────────────────
    {
      resolve: '@medusajs/payment',
      options: {
        providers: [
          {
            resolve: './src/modules/tenant-payment',
            id: 'tenant-phonepe',
            options: {},
          },
        ],
      },
    },

    // ─── Custom: Tenant-Aware S3 File Storage ───────────────────────────────
    {
      resolve: '@medusajs/file',
      key: Modules.FILE,
      options: {
        providers: [
          {
            resolve: './src/modules/tenant-file-service',
            id: 'tenant-s3',
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION || 'blr1',
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT, // DigitalOcean Spaces endpoint
            },
          },
        ],
      },
    },


    // ─── Redis Cache (for session/token caching) ─────────────────────────────
    {
      resolve: '@medusajs/cache-redis',
      key: Modules.CACHE,
      options: {
        redisUrl: process.env.REDIS_URL,
        ttl: 30,
      },
    },

    // ─── Redis Event Bus ─────────────────────────────────────────────────────
    {
      resolve: '@medusajs/event-bus-redis',
      key: Modules.EVENT_BUS,
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],
})
