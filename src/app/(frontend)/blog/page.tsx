// app/blog/page.tsx (или где у тебя лежит)
import { getArticles } from '@/actions/server/blogs/getArticles';
import Article from '@/components/article/Article';
import { Media } from '@/payload-types';
import { Metadata } from 'next';
import React from 'react';

// ✅ Умеренное кэширование: 1 час (3600 сек) — достаточно для блога
export const revalidate = 86400;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// ✅ Structured data для блога
function BlogSchema({ articlesCount }: { articlesCount: number }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Блог | ГрандБАЗАР",
          "description": "Полезные статьи о покупках, доставке, лайфхаках и новинках в интернет-магазине ГрандБАЗАР.",
          "url": `${siteUrl}/blog`,
          "numberOfItems": articlesCount,
          "publisher": {
            "@type": "Organization",
            "name": "ГрандБАЗАР",
            "url": siteUrl 
          }
        })
      }}
    />
  );
}

const BlogsPage = async () => {
  const articles = await getArticles();
  const hasArticles = articles && articles.length > 0;

  return (
    <>
      <BlogSchema articlesCount={hasArticles ? articles.length : 0} />
      <div className='max-w-7xl mx-auto px-4 py-5 h-full flex flex-col gap-5'>
        <h1 className='lg:text-3xl md:text-2xl text-xl font-bold text-black'>
          {hasArticles ? 'Блог' : 'Пока нет статей'}
        </h1>
        {hasArticles ? (
          <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
            {articles.map((article) => (
              <Article
                key={article.id}
                bg={article.background as Media}
                slug={article.slug}
                title={article.title}
              />
            ))}
          </div>
        ) : (
          <div className='flex h-full justify-center items-center'>
            <p className='lg:text-3xl md:text-2xl text-xl font-bold text-black text-center'>
              Пока нет ни одной статьи.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

// ✅ Полные метаданные
export const meta:Metadata = {
  title: "Блог | ГрандБАЗАР",
  description: "Полезные статьи о покупках, доставке, лайфхаках и новинках в интернет-магазине ГрандБАЗАР. Читайте и делитесь!",
  keywords: [
    "блог",
    "статьи",
    "полезные советы",
    "интернет-магазин статьи",
    "ГрандБАЗАР блог",
    "новости магазина",
    "лайфхаки покупок"
  ],
  robots: {
    index: true,   // ← индексировать!
    follow: true,  // ← переходить по ссылкам на статьи
  },
  alternates: {
    canonical: siteUrl ? `${siteUrl}/blog` : undefined,
  },
  openGraph: {
    title: "Блог | ГрандБАЗАР",
    description: "Полезные статьи о покупках, доставке и новинках.",
    type: "website",
    url: siteUrl ? `${siteUrl}/blog` : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог | ГрандБАЗАР",
    description: "Полезные статьи о покупках, доставке и новинках."
  },
};

export default BlogsPage;