// src/app/blog/[slug]/page.tsx
import { getArticleBySlug } from '@/actions/server/blogs/getArticleBySlug';
import jsxConverters from '@/utils/jsx-converters';
import { RichText } from '@payloadcms/richtext-lexical/react';
import "@/styles/richText.scss";
import { notFound } from 'next/navigation';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// ✅ Кэширование: 1 день (можно обновлять через revalidatePath)
export const revalidate = 86400;

// ✅ Structured data для статьи
function ArticleSchema({ article }: { article: any }) {
  const canonicalUrl = siteUrl ? `${siteUrl}/blog/${article.slug}` : undefined;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
          },
          "headline": article.title,
          "description": article.description || article.excerpt || "",
          "author": {
            "@type": "Organization",
            "name": "ГрандБАЗАР"
          },
          "publisher": {
            "@type": "Organization",
            "name": "ГрандБАЗАР",
          },
          "datePublished": article.createdAt || new Date().toISOString(),
          "dateModified": article.updatedAt || article.createdAt || new Date().toISOString(),
          "articleBody": article.content ? "Статья содержит полезную информацию." : undefined,
          "url": canonicalUrl
        }, null, 2)
      }}
    />
  );
}

type Props = {
  params: Promise<{ slug: string }>;
};

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleSchema article={article} />
      <div className="rich-container">
        <RichText data={article.content} converters={jsxConverters} />
      </div>
    </>
  );
};

// ✅ Полные метаданные
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);
    if (!article) {
      return {
        title: "Статья не найдена",
        description: "Запрашиваемая статья не существует.",
        robots: { index: false, follow: false }
      };
    }

    const title = article.title || "Статья | ГрандБАЗАР";
    const description = article.description ||  "Читайте полезные статьи в блоге ГрандБАЗАР";
    const canonicalUrl = siteUrl ? `${siteUrl}/blog/${slug}` : undefined;

    return {
      title: `${title} | ГрандБАЗАР`,
      description,
      keywords: [
        article.title,
        "блог",
        "статья",
        "ГрандБАЗАР"
      ].filter(Boolean),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: canonicalUrl,
        locale: "ru_RU",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Ошибка загрузки статьи",
      description: "Не удалось загрузить статью. Попробуйте позже.",
      robots: { index: false, follow: false }
    };
  }
}

export default ArticlePage;