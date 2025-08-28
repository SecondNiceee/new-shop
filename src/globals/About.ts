import type { GlobalConfig } from "payload"

const About: GlobalConfig = {
  slug: "about",
  label: "О нас",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок страницы",
      required: true,
      defaultValue: "О нас",
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание для SEO",
    },
    {
      name: "blocks",
      type: "blocks",
      label: "Блоки контента",
      blocks: [
        {
          slug: "hero",
          labels: {
            singular: "Hero блок",
            plural: "Hero блоки",
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
              relationTo: "media",
              label: "Фоновое изображение",
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
              relationTo: "media",
              label: "Изображение",
              required: true,
            },
            {
              name: "alt",
              type: "text",
              label: "Alt текст",
              required: true,
            },
            {
              name: "caption",
              type: "text",
              label: "Подпись",
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
              relationTo: "media",
              label: "Изображение",
              required: true,
            },
            {
              name: "alt",
              type: "text",
              label: "Alt текст",
              required: true,
            },
            {
              name: "title",
              type: "text",
              label: "Заголовок",
              required: true,
            },
            {
              name: "content",
              type: "richText",
              label: "Содержимое",
              required: true,
            },
            {
              name: "imagePosition",
              type: "select",
              label: "Позиция изображения",
              options: [
                { label: "Слева", value: "left" },
                { label: "Справа", value: "right" },
              ],
              defaultValue: "left",
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
              label: "Заголовок блока",
              required: true,
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
                  relationTo: "media",
                  label: "Фото",
                },
                {
                  name: "bio",
                  type: "textarea",
                  label: "Биография",
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
