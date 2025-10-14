import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/blog", "/blog/*", "/catalog", "/contacts", "/delivery", "/payment", "/product"],
        disallow: [
          "/account/*",
          "/checkout",
          "/login",
          "/forgotPassword",
          "/verify",
          "/mobile-cart",
          "/payment/success",
          "/api/*",
          "/_next/*",
          "/admin/*",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
