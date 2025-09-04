import { getArticleBySlug } from '@/actions/server/blogs/getArticleBySlug';
import jsxConverters from '@/utils/jsx-converters';
import { RichText } from '@payloadcms/richtext-lexical/react';
import React from 'react';
import "@/styles/richText.scss";

type Props = {
  params: Promise<{ slug: string }>;
};

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  return (
    <div className='rich-container'>
      <RichText data={article?.content} converters={jsxConverters} />
    </div>
  );
};

// Передаём params в generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug); // один и тот же slug
    return {
      title: article?.title || "Статья",
      description: article?.description || "Читайте интересные статьи на нашем сайте",
    };
  } catch (error) {
    return {
      title: "Статья",
      description: "Читайте интересные статьи на нашем сайте",
    };
  }
}

export default ArticlePage;