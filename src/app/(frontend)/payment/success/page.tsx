// app/payment/success/page.tsx
import PaymentSuccessPageClient from "./paymentSuccessClientPage";

export const metadata = {
  title: "Оплата прошла успешно | ГрандБАЗАР",
  description: "Ваш заказ оплачен и принят в обработку. Спасибо за покупку в интернет-магазине ГрандБАЗАР!",
  keywords: ["успешная оплата", "заказ оформлен", "спасибо за покупку", "ГрандБАЗАР"],
  robots: {
    index: false, 
    follow: true,  
  },

  openGraph: {
    title: "Оплата прошла успешно | ГрандБАЗАР",
    description: "Спасибо за покупку! Ваш заказ уже в работе.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
  },

  // Canonical — чтобы избежать дублей
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
  },
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessPageClient />;
}