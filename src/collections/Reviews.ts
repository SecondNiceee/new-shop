import { CollectionConfig } from "payload"

const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    useAsTitle: "product",
    defaultColumns: ["product", "user", "rating", "createdAt"],
    group: "Content", // можно поместить в группу с продуктами
  },
  access: {
    // Все могут читать отзывы
    read: () => true,

    // Только авторизованные пользователи могут оставлять
    create: ({ req }) => {
      return Boolean(req.user)
    },

    // Редактировать — только автор или админ
    update: ({ req }) => {
      const user = req.user
      const docUser = req.data?.user

      return Boolean(
        user?.role === "admin" ||
        user?.id === docUser?.id ||
        user?.id === docUser // подстраховка
      )
    },

    // Удалять — только админ
    delete: ({ req }) => {
      return Boolean(req.user?.role === "admin")
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
        create: () => false, // автоподстановка, нельзя менять при создании
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
      admin: {
        rows: 4,
      },
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
    // ❌ Запрещаем оставлять более одного отзыва на товар от одного пользователя
    beforeChange: [
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
            overrideAccess: true, // важно: проверяем даже если access скрывает
          })

          if (existingReview.docs.length > 0) {
            throw new Error("Вы уже оставили отзыв на этот товар.")
          }
        }
        return data
      },
    ],

    // ✅ Обновляем рейтинг продукта при создании или обновлении отзыва
    afterChange: [
      async ({ doc, operation, req }) => {
        // Обрабатываем только create и update
        if (!["create", "update"].includes(operation)) return doc

        const productId = doc.product

        try {
          // Получаем все отзывы для этого продукта
          const reviews = await req.payload.find({
            collection: "reviews",
            where: { product: { equals: productId } },
            limit: 0,
            overrideAccess: true, // получаем все, игнорируя access
          })

          const count = reviews.docs.length
          const avg =
            count > 0
              ? Math.round((reviews.docs.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
              : 0

          // Обновляем продукт
          await req.payload.update({
            collection: "products",
            id: productId,
            data: {
              averageRating: avg,
              reviewsCount: count,
            },
            overrideAccess: true, // обходим access (иначе может не сработать)
          })
        } catch (error) {
          console.error("Ошибка при обновлении рейтинга продукта:", error)
        }

        return doc
      },
    ],

    // ✅ Обновляем рейтинг при удалении отзыва
    afterDelete: [
      async ({ doc, req }) => {
        const productId = doc.product

        try {
          const reviews = await req.payload.find({
            collection: "reviews",
            where: { product: { equals: productId } },
            limit: 0,
            overrideAccess: true,
          })

          const count = reviews.docs.length
          const avg =
            count > 0
              ? Math.round((reviews.docs.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
              : 0

          await req.payload.update({
            collection: "products",
            id: productId,
            data: {
              averageRating: avg,
              reviewsCount: count,
            },
            overrideAccess: true,
          })
        } catch (error) {
          console.error("Ошибка при обновлении продукта после удаления отзыва:", error)
        }
      },
    ],
  },
}

export default Reviews