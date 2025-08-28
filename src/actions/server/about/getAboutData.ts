"use server"

import { getPayload } from "payload"
import config from "@/payload.config"
import type { About } from "@/payload-types"

export async function getAboutData(): Promise<About | null> {
  try {
    const payload = await getPayload({ config })

    const aboutData = await payload.find({
      collection: "about",
      limit: 1,
    })

    if (aboutData.docs.length === 0) {
      return null
    }

    return aboutData.docs[0] as About
  } catch (error) {
    console.error("Error fetching about data:", error)
    throw new Error("Failed to fetch about data")
  }
}
