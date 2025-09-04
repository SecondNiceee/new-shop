"use server"
import { getPayload } from "payload"
import config from "@payload-config";

export async function getSiteSettings() {
  try {
    const payload = await getPayload({ config })
    const siteSettings = await payload.findGlobal({
      slug: "site-settings",
    })

    return siteSettings
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return null
  }
}
