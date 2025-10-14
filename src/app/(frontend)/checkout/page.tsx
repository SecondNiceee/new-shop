// app/checkout/page.tsx
import type { Metadata } from "next";
import CheckoutClientPage from './checkout-client-page';

export const metadata: Metadata = {
  title: "Оформление заказа | ГрандБАЗАР",
  description: "Проверьте состав заказа, укажите адрес доставки и способ оплаты в интернет-магазине ГрандБАЗАР.",
  
  robots: {
    index: false,   // ← не показывать в поиске
    follow: false,  // ← не переходить по ссылкам (все ссылки и так доступны из других мест)
  },

  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout` 
      : undefined,
  },

  openGraph: {
    title: "Оформление заказа | ГрандБАЗАР",
    description: "Завершите покупку в интернет-магазине ГрандБАЗАР",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout` 
      : undefined
  },

  twitter: {
    card: "summary_large_image",
    title: "Оформление заказа | ГрандБАЗАР",
    description: "Завершите покупку в интернет-магазине ГрандБАЗАР",
  },
};

export default function CheckoutPage() {
  return <CheckoutClientPage />;
}