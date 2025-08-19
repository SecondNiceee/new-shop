// src/scripts/seed-reviews-axios.js
import axios from "axios";

// ========================
// Настройки
// ========================
const API_URL = 'http://localhost:3000/api'; // ← поменяй на свой URL
const ADMIN_EMAIL = 'col1596321@gmail.com';
const ADMIN_PASSWORD = '11559966332211kkKK'; // пароль админа

// Ограничения
const MAX_REVIEWS_PER_USER = 5;
const MIN_REVIEWS_PER_USER = 2;

// ========================
// Данные
// ========================
const COMMENTS = [
  'Товар круть!',
  'Отличный выбор, рекомендую.',
  'Всё пришло вовремя, упаковка целая.',
  'Норм, но можно лучше.',
  'Не самый лучший товар, но за эти деньги — сойдёт.',
  'Очень доволен покупкой!',
  'Хорошее качество, продацу респект.',
  'Быстрая доставка, товар соответствует описанию.',
  'Не понравилось. Не буду брать ещё.',
  'Супер! Куплю ещё раз.',
  'Средне. Ничего особенного.',
  'Лучше, чем ожидал!',
  'Почти отлично, но есть минусы.',
  'Твёрдая пятёрка!',
  'Один раз купил — теперь только сюда.',
];

// Рандомный выбор из массива
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Рандомный рейтинг от 1 до 5
const randomRating = () => Math.floor(Math.random() * 5) + 1;

// ========================
// Глобальный токен
// ========================

// ========================
// Вход в систему
// ========================

// ========================
// Получить все документы с пагинацией
// ========================
async function getAll(collection) {
  let skip = 0;
  const limit = 100;

  const { data } = await axios.get(`${API_URL}/${collection}`, {
    params: { limit, skip, depth: 0 },
  });

  console.log(`✅ Загружено из ${collection}: ${data.docs}`);
  return data.docs;
}

// ========================
// Проверить, есть ли уже отзыв
// ========================
async function hasReview(productID, userID) {
  try {
    console.log('🔍 Проверка на дубль:', { productID, userID })

    const { data } = await axios.get(`${API_URL}/reviews`, {
      params: {
        // 🔥 Вот так правильно: вложенные параметры
        where: {
          and: [
            { product: { equals: productID } },
            { 'user.id': { equals: userID } },
          ],
        },
        limit: 1,
      }
    })
    console.log(productID, userID);

    console.log('✅ Найдено совпадений:', data.docs.length)
    return data.docs.length > 0
  } catch (error) {
    console.error('❌ Ошибка в hasReview:', error.response?.data || error.message)
    return false
  }
}
// ========================
// Создать отзыв
// ========================
async function createReview(productID, userID, rating, comment) {
  try {
    // 🔧 Превращаем в строки
    const safeProductID = String(productID)
    const safeUserID = String(userID)

    console.log('📤 Создаём отзыв:', { user: safeUserID, product: safeProductID })

    await axios.post(
      `${API_URL}/reviews`,
      {
        product: safeProductID, // ← строка
        user: safeUserID,      // ← строка
        rating,
        comment,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )

    console.log(`✅ Отзыв создан: user=${safeUserID}, product=${safeProductID}, rating=${rating}`)
  } catch (error) {
    const message = error.response?.data?.errors?.[0]?.message || error.response?.data || error.message
    console.error(`❌ Ошибка создания отзыва:`, message)
    // 🔍 Добавим детали
    if (error.response) {
      console.error('🔍 Status:', error.response.status)
      console.error('🔍 Data:', error.response.data)
    }
  }
}

// ========================
// Основная функция
// ========================
async function seedReviews() {
  console.log('🚀 Запуск сидирования отзывов через API...');

  // await login();

  const users = await getAll('users');
  const products = await getAll('products');

  console.log(`👥 Пользователей: ${users.length}`);
  console.log(`📦 Товаров: ${products.length}`);

  if (users.length === 0 || products.length === 0) {
    console.warn('⚠️ Нет пользователей или товаров — выходим.');
    return;
  }

  let createdCount = 0;

  for (const user of users) {
    const numReviews = Math.floor(Math.random() * (MAX_REVIEWS_PER_USER - MIN_REVIEWS_PER_USER + 1)) + MIN_REVIEWS_PER_USER;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numReviews);

    for (const product of selected) {
      const exists = await hasReview(product.id, user.id);
      if (exists) {
        console.log(`⏭️  Пропущено: ${user.email} уже оставил отзыв на "${product.title}"`);
        continue;
      }

      const rating = randomRating();
      const comment = random(COMMENTS);

      await createReview(product.id, user.id, rating, comment);
      createdCount++;
    }
  }

  console.log(`\n✨ Готово! Создано ${createdCount} отзывов через API.`);
}

// ========================
// Запуск, если файл вызван напрямую

// ✅ Экспортируем по умолчанию для import
seedReviews();