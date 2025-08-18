// src/collections/Reviews.ts
import { CollectionConfig } from "payload";

const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    useAsTitle: "product",
    defaultColumns: ["product", "user", "rating", "createdAt"],
    group: "Content", // можно поместить в ту же группу, что и продукты
  },
  access: {
    // Все могут читать отзывы
    read: () => true,

    // Только авторизованные пользователи могут создавать
    create: ({ req }) => {
      return Boolean(req.user);
    },

    // Обновлять — только админ или владелец отзыва
    update: ({ req }) => {
      return Boolean(
        req.user?.role === "admin" ||
        req.user?.id === req.data?.user?.id
      );
    },

    // Удалять — только админ
    delete: ({ req }) => {
      return Boolean(req.user?.role === "admin");
    },
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      defaultValue: ({ user }) => user?.id,
      access: {
        create: () => false, // автоматически подставляется при создании
        read: () => true,
      },
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "rating",
      type: "number",
      label: "Оценка",
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        step: 1,
        position: "sidebar",
      },
    },
    {
      name: "comment",
      type: "textarea",
      label: "Комментарий",
      required: false,
      minLength: 10,
      maxLength: 1000,
    },
    {
      name: "createdAt",
      type: "date",
      label: "Дата",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Запрещаем оставлять более одного отзыва на один товар от одного пользователя
      async ({ operation, data, req }) => {
        if (operation === "create") {
          const existingReview = await req.payload.find({
            collection: "reviews",
            where: {
              and: [
                { product: { equals: data.product } },
                { user: { equals: req.user?.id } },
              ],
            },
            limit: 1,
            overrideAccess: false, // учитываем права доступа
          });

          if (existingReview.docs.length > 0) {
            throw new Error("Вы уже оставили отзыв на этот товар.");
          }
        }
        return data;
      },
    ],
  },
};

export default Reviews;