import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from "next/navigation"
import jsxConverters from '@/utils/jsx-converters';
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave';
import "@/styles/richText.scss";
import { getDelivery } from '@/actions/server/pages/getDelivery';
import { getPayment } from '@/actions/server/pages/getPayment';

export default async function AboutPage() {
  try {
    const payment = await getPayment();
    // Если данных нет
    if (!payment) {
      notFound()
    }
    return (
      <div className="rich-container">
        <RefreshRouteOnSave route='/delivery'   />
        <RichText converters={jsxConverters} data={payment.content} />
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
    const paymentData = await getDelivery()
    return {
      title: paymentData.title || "Оплата",
      description: paymentData?.description || "Узнайте больше об оплате в компании ГрандБАЗАР",
    }
  } catch (error) {
    return {
      title: "Оплата",
      description: "Узнайте больше об оплате в компании ГрандБАЗАР",
    }
  }
}
