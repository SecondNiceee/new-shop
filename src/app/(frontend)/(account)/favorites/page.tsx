// src/app/account/favorites/page.tsx
import React from 'react';
import FavoritesClientPage from './favorites-client';
import { Metadata } from 'next';

// 🔒 Запрещаем индексацию — это приватная страница
export const metadata: Metadata = {
  title: 'Избранное — ГрандБАЗАР',
  description: 'Ваши сохранённые товары в интернет-магазине ГрандБАЗАР',
  robots: {
    index: false,    // ← не индексировать
    follow: false,   // ← не следовать по ссылкам
  },
  // Убираем соцсетевые метатеги — не нужно для личной страницы
  openGraph: undefined,
  twitter: undefined,
};

const Favorites = () => {
  return <FavoritesClientPage />;
};

export default Favorites;