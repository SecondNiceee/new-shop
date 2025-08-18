import { CollectionConfig } from "payload";

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  access: {
  read: () => true,
  create: () => true,
  update: () => true,
  delete: () => true,
},
  hooks: {
    afterRead: [
      ({ doc, findMany }) => {
        if (findMany && doc) {
          const {description, storageConditions, ingredients, recommendedProducts, nutritionalValue, ...rest } = doc;
          return rest
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      label: 'Цена',
      required: true,
    },
    {
      name: 'weight',
      type: 'group',
      label: 'Вес/Объем',
      fields: [
        {
          name: 'value',
          type: 'number',
          label: 'Значение',
          required: true,
          min: 0,
        },
        {
          name: 'unit',
          type: 'select',
          label: 'Единица измерения',
          required: true,
          options: [
            {
              label: 'Килограммы (кг)',
              value: 'кг',
            },
            {
              label: 'Граммы (г)',
              value: 'г',
            },
            {
              label: 'Литры (л)',
              value: 'л',
            },
            {
              label: 'Миллилитры (мл)',
              value: 'мл',
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Категория',
      relationTo: 'categories',
      required : true,
      hasMany: true,
      admin: {
        description: 'Выберите только категорию, без подкатегорий',
      },
      filterOptions: () => {
        return {
          parent: { exists: false },
        };
      },
    },
    {
      name: 'subCategory',
      type: 'relationship',
      label: 'Подкатегория',
      relationTo: 'categories',
      required : true,
      hasMany: false,
      admin: {
        description: 'Выберите подкатегорию',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Фотография',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Загрузите основное изображение продукта',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание товара',
      required: false,
    },
    {
      name: 'storageConditions',
      type: 'text',
      label: 'Условия хранения',
      required: false,
    },
    {
      name: 'ingredients',
      type: 'text',
      label: 'Состав',
      required: false,
    },
    {
      name: 'recommendedProducts',
      type: 'relationship',
      label: 'Рекомендованные продукты',
      relationTo: 'products',
      hasMany: true,
      required: false,
    },
    {
      name: 'nutritionalValue',
      type: 'group',
      label: 'Энергетическая и пищевая ценность',
      fields: [
        {
          name: 'calories',
          type: 'number',
          label: 'Калории',
          required: false,
        },
        {
          name: 'proteins',
          type: 'number',
          label: 'Белки (г)',
          required: false,
          min: 0,
        },
        {
          name: 'carbohydrates',
          type: 'number',
          label: 'Углеводы (г)',
          required: false,
          min: 0,
        },
        {
          name: 'fats',
          type: 'number',
          label: 'Жиры (г)',
          required: false,
          min: 0,
        },
        {
          name: 'fiber',
          type: 'number',
          label: 'Клетчатка (г)',
          required: false,
          min: 0,
        },
      ],
    },
    {
      name: "averageRating",
      type: "number",
      label: "Средний рейтинг",
      defaultValue: 0,
      min: 0,
      max: 5,
      admin: {
        readOnly: true,
        description: "Обновляется автоматически при добавлении отзыва",
      },
    },
    {
      name: "reviewsCount",
      type: "number",
      label: "Количество отзывов",
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },

  ],
};

export default Products;
