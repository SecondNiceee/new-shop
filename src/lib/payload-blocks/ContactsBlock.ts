import type { Block } from "payload"

export const ContactsBlock: Block = {
  slug: "contacts",
  labels: {
    singular: "Контакты",
    plural: "Контакты",
  },
  fields: [
    {
      name: "contacts",
      type: "array",
      label: "Список контактов",
      minRows: 1,
      maxRows: 10,
      admin: {
        description: "Добавьте контактную информацию для отображения на сайте",
      },
      fields: [
        {
          name: "key",
          type: "text",
          label: "Название контакта",
          required: true,
          admin: {
            description: "Название контакта (например: WhatsApp, Email, Телефон)",
          },
        },
        {
          name: "valueType",
          type: "select",
          label: "Тип значения",
          required: true,
          options: [
            { label: "Текст", value: "text" },
            { label: "Ссылка", value: "link" },
          ],
          defaultValue: "text",
          admin: {
            description: "Выберите тип отображаемого значения",
          },
        },
        {
          name: "value",
          type: "text",
          label: "Значение",
          required: true,
          admin: {
            description: "Значение контакта (текст или URL)",
          },
        },
        {
          name: "icon",
          type: "upload",
          label: "Иконка",
          relationTo : "media",
          admin: {
            description: "Иконка для контакта (необязательно)",
          },
        },
      ],
    },
  ],
}
