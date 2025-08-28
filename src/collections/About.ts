import { isAdmin } from "@/utils/accessUtils"
import type { CollectionConfig } from "payload"

const About: CollectionConfig = {
  slug: "about",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок страницы",
      required: true,
      defaultValue: "О нас",
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Мета-описание",
      maxLength: 160,
      admin: {
        description: "Описание для поисковых систем (до 160 символов)",
      },
    },
    {
      name: "content",
      type: "blocks",
      label: "Содержимое страницы",
      blocks: [
        {
          slug: "hero",
          labels: {
            singular: "Главный блок",
            plural: "Главные блоки",
          },
          fields: [
            {
              name: "title",
              type: "text",
              label: "Заголовок",
              required: true,
            },
            {
              name: "subtitle",
              type: "textarea",
              label: "Подзаголовок",
            },
            {
              name: "backgroundImage",
              type: "upload",
              label: "Фоновое изображение",
              relationTo: "media",
            },
          ],
        },
        {
          slug: "textBlock",
          labels: {
            singular: "Текстовый блок",
            plural: "Текстовые блоки",
          },
          fields: [
            {
              name: "title",
              type: "text",
              label: "Заголовок",
            },
            {
              name: "content",
              type: "richText",
              label: "Содержимое",
              required: true,
            },
            {
              name: "alignment",
              type: "select",
              label: "Выравнивание",
              options: [
                { label: "По левому краю", value: "left" },
                { label: "По центру", value: "center" },
                { label: "По правому краю", value: "right" },
              ],
              defaultValue: "left",
            },
          ],
        },
        {
          slug: "imageBlock",
          labels: {
            singular: "Блок с изображением",
            plural: "Блоки с изображениями",
          },
          fields: [
            {
              name: "image",
              type: "upload",
              label: "Изображение",
              relationTo: "media",
              required: true,
            },
            {
              name: "alt",
              type: "text",
              label: "Альтернативный текст",
              required: true,
            },
            {
              name: "caption",
              type: "text",
              label: "Подпись к изображению",
            },
            {
              name: "size",
              type: "select",
              label: "Размер изображения",
              options: [
                { label: "Маленький", value: "small" },
                { label: "Средний", value: "medium" },
                { label: "Большой", value: "large" },
                { label: "Во всю ширину", value: "full" },
              ],
              defaultValue: "medium",
            },
          ],
        },
        {
          slug: "imageTextBlock",
          labels: {
            singular: "Блок изображение + текст",
            plural: "Блоки изображение + текст",
          },
          fields: [
            {
              name: "image",
              type: "upload",
              label: "Изображение",
              relationTo: "media",
              required: true,
            },
            {
              name: "alt",
              type: "text",
              label: "Альтернативный текст",
              required: true,
            },
            {
              name: "title",
              type: "text",
              label: "Заголовок",
            },
            {
              name: "content",
              type: "richText",
              label: "Текст",
              required: true,
            },
            {
              name: "layout",
              type: "select",
              label: "Расположение",
              options: [
                { label: "Изображение слева", value: "imageLeft" },
                { label: "Изображение справа", value: "imageRight" },
              ],
              defaultValue: "imageLeft",
            },
          ],
        },
        {
          slug: "statsBlock",
          labels: {
            singular: "Блок статистики",
            plural: "Блоки статистики",
          },
          fields: [
            {
              name: "title",
              type: "text",
              label: "Заголовок блока",
            },
            {
              name: "stats",
              type: "array",
              label: "Статистика",
              fields: [
                {
                  name: "number",
                  type: "text",
                  label: "Число",
                  required: true,
                },
                {
                  name: "label",
                  type: "text",
                  label: "Описание",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: "teamBlock",
          labels: {
            singular: "Блок команды",
            plural: "Блоки команды",
          },
          fields: [
            {
              name: "title",
              type: "text",
              label: "Заголовок",
              defaultValue: "Наша команда",
            },
            {
              name: "members",
              type: "array",
              label: "Участники команды",
              fields: [
                {
                  name: "name",
                  type: "text",
                  label: "Имя",
                  required: true,
                },
                {
                  name: "position",
                  type: "text",
                  label: "Должность",
                  required: true,
                },
                {
                  name: "photo",
                  type: "upload",
                  label: "Фотография",
                  relationTo: "media",
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Описание",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default About
