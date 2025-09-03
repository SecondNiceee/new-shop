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
      minRows: 1,
      maxRows: 10,
      admin: {
        description: "Список контактов",
      },
      fields: [
        {
          name: "key",
          type: "text",
          required: true,
          admin: {
            description: "Название контакта (например: WhatsApp, Email, Телефон)",
          },
        },
        {
          name: "valueType",
          type: "select",
          required: true,
          options: [
            { label: "Текст", value: "text" },
            { label: "Ссылка", value: "link" },
          ],
          defaultValue: "text",
          admin: {
            description: "Тип значения",
          },
        },
        {
          name: "value",
          type: "text",
          required: true,
          admin: {
            description: "Значение (текст или URL)",
          },
        },
        {
          name: "icon",
          type: "upload",
          relationTo : "media",
          admin: {
            description: "Иконка (необязательно, например: phone, email, whatsapp)",
          },
        },
      ],
    },
  ],
}
