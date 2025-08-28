import { getAboutData } from "@/actions/server/about/getAboutData"
import BlockRenderer from "@/components/about/ui/block-renderer"
import type { AboutBlock } from "@/components/about/types/about-types"
import { notFound } from "next/navigation"

export default async function AboutPage() {
  try {
    const aboutData = await getAboutData()

    // Если данных нет
    if (!aboutData) {
      notFound()
    }

    return (
      <div className="min-h-screen">
        <BlockRenderer blocks={(aboutData.blocks as AboutBlock[]) || []} />
      </div>
    )
  } catch (error) {
    console.error("Error loading about page:", error)
    notFound()
  }
}

// Метаданные для SEO
export async function generateMetadata() {
  try {
    const aboutData = await getAboutData()

    return {
      title: aboutData?.title || "О нас",
      description: aboutData?.description || "Узнайте больше о нашей компании ГрандБАЗАР",
    }
  } catch (error) {
    return {
      title: "О нас",
      description: "Узнайте больше о нашей компании ГрандБАЗАР",
    }
  }
}
