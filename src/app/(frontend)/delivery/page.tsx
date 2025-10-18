import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from "next/navigation"
import jsxConverters from '@/utils/jsx-converters';
import "@/styles/richText.scss";
import { getDelivery } from '@/actions/server/pages/getDelivery';
import { DeliverySchema } from './deliverySchema';

export const revalidate = 31536000; // 1 год
export default async function AboutPage() {
  try {
    const delivery = await getDelivery();
    // Если данных нет
    if (!delivery) {
      notFound()
    }
    const title = delivery.title || "Доставка | ГрандБАЗАР";
    const description = delivery.description || "Условия доставки в ГрандБАЗАР";
    return (
      <>
       <DeliverySchema title={title} description={description} />
        <div className="rich-container">
          <RichText converters={jsxConverters} data={delivery.content} />
        </div>
      </>
    )
  } catch (error) {
    console.error("Error loading about page:", error)
    notFound()
  }
}

// Метаданные для SEO
export async function generateMetadata() {
  try {
    const deliveryData = await getDelivery();
    const title = deliveryData.title;
    const description = deliveryData.description
    return {
      title: deliveryData.title || "Доставка",
      description: deliveryData?.description || "Узнайте больше о нашей доставке в компании ГрандБАЗАР",
      keywords: ["доставка", "условия доставки", "сроки доставки", "ГрандБАЗАР", "интернет-магазин доставка"],
      openGraph : {
        title,
        description,
        type : "website",
        url: `${process.env.NEXT_PUBLIC_URL}/delivery`
      }
    }
  } catch (error) {
    const title = "Доставка"
    const description = "Узнайте больше о нашей доставке в компании ГрандБАЗАР"
    return {
      title,
      description,
      keywords: ["доставка", "условия доставки", "сроки доставки", "ГрандБАЗАР", "интернет-магазин доставка"],
      openGraph: {
        title,
        description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_URL}/delivery`, 
      },
    }
  }
}
