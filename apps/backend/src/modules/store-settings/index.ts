import { Module } from "@medusajs/framework/utils"
import StoreSettingsService from "./service"
import { StoreSettings } from "./model"

export const STORE_SETTINGS_MODULE = "storeSettings"

export default Module(STORE_SETTINGS_MODULE, {
  service: StoreSettingsService,
})
