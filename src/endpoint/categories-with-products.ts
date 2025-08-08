import { Endpoint, PayloadRequest } from "payload";

export const CategoriesWithProductsEndpoint:Endpoint = {
  path: '/categories-with-products',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    const { payload } = req;
    const { page = 1, limit = 10 } = req.query; // Пагинация: page и limit из query-параметров
    try {
      // Шаг 1: Получить основные категории с пагинацией
      const categoriesResult = await payload.find({
        collection: 'categories',
        where: {
          parent: { exists: false }, // Только категории без родителя
        },
        sort : "createdAt",
        page: 0,
        limit: 0,
        depth: 1, // Глубина для получения полных данных категории
      });

      // Шаг 2: Для каждой категории найти до 6 товаров
      const result = await Promise.all(
        categoriesResult.docs.map(async (category) => {
          const products = await payload.find({
            collection: 'products',
            where: {
              category: { equals: category.id }, // Товары, связанные с этой категорией
            },
            limit: 6, // Ограничение до 6 товаров
            depth: 1, // Глубина для получения полных данных товаров
          });
          const productCounter = await payload.count({
            collection : 'products',
            where : {
                category : {equals : category.id}
            }
          })

          return {
            category,
            products: products.docs,
            productsCounter : productCounter.totalDocs
             // Массив товаров (до 6)
          };
        })
      );

      // Шаг 3: Формируем ответ с пагинацией
      return Response.json(result);
    } catch (error) {
      console.error('Error in categories-with-products endpoint:', error);
      return Response.json({ error: 'Internal Server Error' });
    }
  },
};
