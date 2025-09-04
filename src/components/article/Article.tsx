import { Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

interface IArticle{
    bg : Media,
    title : string,
    slug : string
}
const Article:FC<IArticle> = ({bg, slug, title}) => {
    return (
        <Link href={`/blog/${slug}`} className='w-full p-2 flex flex-col rounded-xl gap-2 bg-gray-100 shadow-lg'>
            <Image className='w-full rounded-xl' width={200} height={200} src={String(bg.url)} alt={bg.alt}  />
            <h5 className='md:text-lg text-base font-semibold'>
                {title}
            </h5>
        </Link>
    );
};

export default Article;