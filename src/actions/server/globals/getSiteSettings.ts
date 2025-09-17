"use server"
import { getPayload } from "payload"
import config from "@payload-config"
import { unstable_cache } from "next/cache"

export const getSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: "site-settings",
    })
    return settings
  },
  ["site-settings"], // ← ключ кеша остается
  {
    revalidate: 31536000, // ← живёт 1 год, пока не сбросим тегом
    tags: ["site-settings"], // ← добавляем tags для работы с revalidateTag
  },
)
