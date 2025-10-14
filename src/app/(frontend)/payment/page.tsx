// app/payment/page.tsx
import { RichText } from '@payloadcms/richtext-lexical/react';
import { notFound } from "next/navigation";
import jsxConverters from '@/utils/jsx-converters';
import { RefreshRouteOnSave } from '@/utils/RefreshRouteOnSave';
import "@/styles/richText.scss";
import { getPayment } from '@/actions/server/pages/getPayment';

// ✅ Умеренное кэширование: 1 день (86400 сек)
export const revalidate = 86400;

function PaymentSchema({ title, description }: { title: string; description: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": `${process.env.NEXT_PUBLIC_URL}/payment`,
          "publisher": {
            "@type": "Organization",
            "name": "ГрандБАЗАР",
            "url": process.env.NEXT_PUBLIC_URL
          },
          "about": "Оплата заказов в интернет-магазине"
        })
      }}
    />
  );
}

export default async function PaymentPage() {
  try {
    const payment = await getPayment();
    if (!payment) {
      notFound();
    }
    const title = payment.title || "Оплата | ГрандБАЗАР";
    const description = 
      payment.description || 
      "Условия и способы оплаты заказов в интернет-магазине ГрандБАЗАР: банковские карты, СБП, наличные при получении и другие варианты.";
    return (
      <>
        <PaymentSchema title={title} description={description} />
        <div className="rich-container">
          <RefreshRouteOnSave route="/payment" />
          <RichText converters={jsxConverters} data={payment.content} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading payment page:", error);
    notFound();
  }
}

// ✅ Полноценные метаданные для SEO и соцсетей
export async function generateMetadata() {
  try {
    // 🔥 ИСПРАВЛЕНО: было getDelivery() → стало getPayment()
    const paymentData = await getPayment();

    const title = paymentData?.title 
      ? `${paymentData.title} | ГрандБАЗАР` 
      : "Оплата | ГрандБАЗАР";

    const description = 
      paymentData?.description || 
      "Условия и способы оплаты заказов в интернет-магазине ГрандБАЗАР: банковские карты, СБП, наличные при получении и другие варианты.";


    return {
      title,
      description,
      keywords: [
        "оплата",
        "способы оплаты",
        "оплатить заказ",
        "онлайн оплата",
        "оплата по СБП",
        "оплата картой",
        "наличные при получении",
        "ГрандБАЗАР оплата",
        "безопасная оплата"
      ],
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/payment`,
      },
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_URL}/payment`,
        type: "website",
      }
    };
  } catch (error) {
    return {
      title: "Оплата | ГрандБАЗАР",
      description: "Условия и способы оплаты заказов в интернет-магазине ГрандБАЗАР.",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/payment`,
      },
    };
  }
}