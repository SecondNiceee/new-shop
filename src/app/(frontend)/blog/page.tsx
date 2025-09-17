import { getArticles } from '@/actions/server/blogs/getArticles';
import Article from '@/components/article/Article';
import { Media } from '@/payload-types';
import React from 'react';
export const dynamic = 'auto';

export const revalidate = 31536000; // 1 год
const BlogsPage = async () => {
    const articles = await getArticles();
    if (!articles || !articles.length){
        return (
            <div className='max-w-7xl mx-auto px-4 py-5 flex h-full justify-center items-center'>
                <h3 className='lg:text-3xl md:text-2xl text-xl font-bold text-black text-center'>
                    Пока нет ни одной статьи.
                </h3>
            </div>
        );
    }
    return (
        <div className='max-w-7xl mx-auto px-4 py-5 h-full flex flex-col gap-5'>
            <h3 className='lg:text-3xl md:text-2xl text-xl font-bold text-black'>Блог</h3>
            <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
                {articles.map( (article) => <Article bg={article.background as Media} slug={article.slug} title={article.title} /> )}
            </div>
        </div>
    )
};

export default BlogsPage;