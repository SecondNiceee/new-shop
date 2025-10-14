// app/sitemap.ts
import type { MetadataRoute } from "next";

// ✅ Защита от invalid дат
function safeDate(dateString: string | null | undefined): Date {
  if (!dateString) return new Date();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/payment`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${siteUrl}/api/blogs?limit=1000&select[slug]=true&select[updatedAt]=true`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      blogRoutes = data.docs.map((blog: any) => ({
        url: `${siteUrl}/blog/${blog.slug}`,
        lastModified: safeDate(blog.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    console.error("Blogs sitemap error:", e);
  }

  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${siteUrl}/api/categories?limit=100&where[parent][exists]=false&select[value]=true&select[updatedAt]=true`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      categoryRoutes = data.docs.map((cat: any) => ({
        url: `${siteUrl}/${cat.value}`,
        lastModified: safeDate(cat.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));
    }
  } catch (e) {
    console.error("Categories sitemap error:", e);
  }

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${siteUrl}/api/products?limit=10000&select=id,updatedAt`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      productRoutes = data.docs.map((product: any) => ({
        url: `${siteUrl}/product?id=${product.id}`,
        lastModified: safeDate(product.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error("Products sitemap error:", e);
  }

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes, ...productRoutes];
}