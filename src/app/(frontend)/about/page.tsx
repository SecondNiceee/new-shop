import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from "next/navigation"
import { getPayload } from 'payload';
import config from "@payload-config";
import { getAbout } from '@/actions/server/pages/getAbout';

export default async function AboutPage() {
  try {
    const about = await getAbout();
    // Если данных нет
    if (!about) {
      notFound()
    }

    return (
      <div className="max-w-7xl">
        <RichText data={about.content} />
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
      title: "О нас",
      description: aboutData?.description || "Узнайте больше о нашей компании ГрандБАЗАР",
    }
  } catch (error) {
    return {
      title: "О нас",
      description: "Узнайте больше о нашей компании ГрандБАЗАР",
    }
  }
}
