"use server"

import { getPayload } from "payload"
import config from "@/payload.config"

export async function getAboutData() {
  try {
    const payload = await getPayload({ config })

    const aboutData = await payload.findGlobal({
        slug : "about"
    })

    return aboutData
  } catch (error) {
    console.error("Error fetching about data:", error)
    throw new Error("Failed to fetch about data")
  }
}
