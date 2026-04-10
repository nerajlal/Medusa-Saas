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
    {
      resolve: '@medusajs/auth',
      options: {
        providers: [
          {
            resolve: '@medusajs/auth-emailpass',
            id: 'emailpass',
          },
        ],
      },
    },

    // ─── Custom: StoreSettings (tenant credentials & config) ────────────────
    {
      resolve: "./src/modules/store-settings",
      key: "storeSettings",
    },

    /*
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
    */


    // ─── File Provider (local storage for dev) ────────────────────────────────
    {
      resolve: '@medusajs/file',
      key: Modules.FILE,
      options: {
        providers: [
          {
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {},
          },
        ],
      },
    },

    // ─── Fulfillment Provider (manual for dev) ──────────────────────────────
    {
      resolve: '@medusajs/fulfillment',
      options: {
        providers: [
          {
            resolve: '@medusajs/fulfillment-manual',
            id: 'manual',
            options: {},
          },
        ],
      },
    },
    // ─── Notification Provider (local for dev) ────────────────────────────────
    {
      resolve: '@medusajs/notification',
      options: {
        providers: [
          {
            resolve: '@medusajs/notification-local',
            id: 'local',
            options: {},
          },
        ],
      },
    },

    // ─── In-Memory Cache (for local demo) ───────────────────────────────────
    {
      resolve: '@medusajs/cache-inmemory',
      key: Modules.CACHE,
      options: {},
    },

    // ─── In-Memory Event Bus ────────────────────────────────────────────────
    {
      resolve: '@medusajs/event-bus-local',
      key: Modules.EVENT_BUS,
      options: {},
    },

  ],
})
