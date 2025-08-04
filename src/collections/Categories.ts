// src/collections/Categories.ts
import { Categories } from '@/components/categories/categories';
import type { CollectionConfig } from 'payload'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      label: 'Родительская категория',
      relationTo: "categories",
      required: false,
      admin: {
        description: 'Если не выбрано — это основная категория',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      label: 'Иконка',
      relationTo: 'media',
      required: false, // Обязательно только для родителей
      admin: {
        condition: (_, { parent }) => !parent, // Показываем только если нет родителя
        description: 'Иконка нужна только для основных категорий',
      },
    },
  ],
};

export default Categories;