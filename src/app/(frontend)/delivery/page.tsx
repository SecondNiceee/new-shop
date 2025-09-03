import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from "next/navigation"
import jsxConverters from '@/utils/jsx-converters';
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave';
import "@/styles/richText.scss";
import { getDelivery } from '@/actions/server/pages/getDelivery';

export default async function AboutPage() {
  try {
    const delivery = await getDelivery();
    // Если данных нет
    if (!delivery) {
      notFound()
    }
    return (
      <div className="rich-container">
        <RefreshRouteOnSave route='/delivery'   />
        <RichText converters={jsxConverters} data={delivery.content} />
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
    const deliveryData = await getDelivery()
    return {
      title: deliveryData.title || "Доставка",
      description: deliveryData?.description || "Узнайте больше о нашей доставке в компании ГрандБАЗАР",
    }
  } catch (error) {
    return {
      title: "Доставка",
      description: "Узнайте больше о нашей доставке в компании ГрандБАЗАР",
    }
  }
}
