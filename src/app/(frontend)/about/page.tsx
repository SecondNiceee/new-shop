import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from "next/navigation"
import { getAbout } from '@/actions/server/pages/getAbout';
import jsxConverters from '@/utils/jsx-converters';

export default async function AboutPage() {
  try {
    const about = await getAbout();
    // Если данных нет
    console.log(about);
    if (!about) {
      notFound()
    }


    return (
      <div className="max-w-7xl mx-auto">
        <RichText converters={jsxConverters} data={about.content} />
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
    const aboutData = await getAbout()
    return {
      title: aboutData.title || "О нас",
      description: aboutData?.description || "Узнайте больше о нашей компании ГрандБАЗАР",
    }
  } catch (error) {
    return {
      title: "О нас",
      description: "Узнайте больше о нашей компании ГрандБАЗАР",
    }
  }
}
