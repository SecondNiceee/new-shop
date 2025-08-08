// update-products.js
import axios from "axios";
import { LoremIpsum } from "lorem-ipsum"; // ✅ Правильный импорт

// Базовый URL для REST API Payload CMS
const BASE_URL = 'http://localhost:3000/api/products';

// Генератор lorem ipsum
const lorem = new LoremIpsum({
  sentencesPerParagraph: { max: 3, min: 1 },
  wordsPerSentence: { max: 10, min: 5 },
});

// Варианты для storageConditions
const storageConditionsOptions = [
  'Хранить при температуре 0-5°C',
  'Сухое прохладное место',
  'Хранить в холодильнике при 2-8°C',
  'Избегать прямых солнечных лучей',
  'Хранить при комнатной температуре',
];

// Варианты для ingredients
const ingredientsOptions = [
  'Мука, сахар, соль, вода',
  'Вода, масло, специи, дрожжи',
  'Мясо, соль, перец, лук',
  'Молоко, сливки, сахар, ваниль',
  'Рыба, соль, лимонная кислота',
  'Овощи, масло, уксус, специи',
];

// Функция для генерации случайного числа в диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для выбора случайных элементов из массива
function getRandomItems(array, maxItems) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  const count = getRandomInt(0, maxItems);
  return shuffled.slice(0, count);
}

// Функция для получения всех товаров
async function getAllProducts() {
  try {
    const response = await axios.get(`${BASE_URL}?limit=0&depth=0`);
    return response.data.docs;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
}

// Функция для обновления товара
async function updateProduct(id, updates) {
  try {
    await axios.patch(`${BASE_URL}/${id}`, updates, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ Updated product ID ${id}`);
  } catch (error) {
    console.error(`❌ Error updating product ID ${id}:`, error.message);
    throw error;
  }
}

// Основная функция
async function updateProductsFields() {
  try {
    const products = await getAllProducts();
    console.log(`🔍 Found ${products.length} products`);

    const productIds = products.map(product => product.id);

    for (const product of products) {
      const updates = {};
      let needsUpdate = false;

      // description
      if (typeof product.description === 'undefined') {
        updates.description = lorem.generateSentences(2);
        needsUpdate = true;
      }

      // storageConditions
      if (typeof product.storageConditions === 'undefined') {
        updates.storageConditions = storageConditionsOptions[getRandomInt(0, storageConditionsOptions.length - 1)];
        needsUpdate = true;
      }

      // ingredients
      if (typeof product.ingredients === 'undefined') {
        updates.ingredients = ingredientsOptions[getRandomInt(0, ingredientsOptions.length - 1)];
        needsUpdate = true;
      }

      // recommendedProducts
      if (typeof product.recommendedProducts === 'undefined') {
        const availableIds = productIds.filter(id => id !== product.id);
        updates.recommendedProducts = getRandomItems(availableIds, 3);
        needsUpdate = true;
      }

      // nutritionalValue
      if (typeof product.nutritionalValue === 'undefined') {
        updates.nutritionalValue = {
          calories: getRandomInt(50, 500),
          proteins: getRandomInt(0, 50),
          carbohydrates: getRandomInt(0, 100),
          fats: getRandomInt(0, 50),
          fiber: getRandomInt(0, 20),
        };
        needsUpdate = true;
      }

      if (needsUpdate) {
        await updateProduct(product.id, updates);
      } else {
        console.log(`⏭️ Product ID ${product.id} already complete`);
      }
    }

    console.log('🎉 All products updated successfully!');
  } catch (error) {
    console.error('💥 Error updating products:', error.message);
  } finally {
    process.exit(0);
  }
}

// Запуск
updateProductsFields();