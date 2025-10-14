import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
  const apiUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

  // Static routes
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
  ]

  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const blogsResponse = await fetch(`${apiUrl}/api/blogs?limit=1000&select=slug,updatedAt`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json()
      blogRoutes = blogsData.docs.map((blog: any) => ({
        url: `${siteUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error)
  }

  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const categoriesResponse = await fetch(
      `${apiUrl}/api/categories?limit=100&where[parent][exists]=false&select=value,updatedAt`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json()
      categoryRoutes = categoriesData.docs.map((category: any) => ({
        url: `${siteUrl}/${category.value}`,
        lastModified: new Date(category.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error)
  }

  // Combine all routes
  return [...staticRoutes, ...blogRoutes, ...categoryRoutes]
}
