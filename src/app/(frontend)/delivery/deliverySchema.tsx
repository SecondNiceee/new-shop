
export function DeliverySchema({ title, description }: { title: string; description: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": `${siteUrl}/delivery`,
          "publisher": {
            "@type": "Organization",
            "name": "ГрандБАЗАР",
            "url": siteUrl
          },
          "about": "Информация об условиях, сроках и стоимости доставки заказов"
        }, null, 2)
      }}
    />
  );
}