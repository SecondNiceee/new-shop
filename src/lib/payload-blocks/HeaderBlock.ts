import type { Block } from "payload"

export const HeaderBlock: Block = {
  slug: "header",
  labels: {
    singular: "Заголовок",
    plural: "Заголовки",
  },
  fields: [
    {
      name: "text",
      type: "text",
      label: "Текст заголовка",
      admin: {
        description: "Введите текст заголовка",
      },
    },
    {
      name: "level",
      type: "select",
      label: "Уровень заголовка",
      defaultValue: "h3",
      options: [
        { label: "Заголовок 3 (основной)", value: "h3" },
        { label: "Заголовок 4", value: "h4" },
        { label: "Заголовок 5", value: "h5" },
        { label: "Заголовок 6", value: "h6" },
      ],
      admin: {
        description: "Выберите уровень заголовка (H1-H6)",
      },
    },
    {
      name: "color",
      type: "select",
      label: "Цвет заголовка",
      defaultValue: "black",
      options: [
        { label: "Черный", value: "black" },
        { label: "Белый", value: "white" },
        { label: "Серый", value: "gray" },
        { label: "Красный", value: "red" },
        { label: "Синий", value: "blue" },
        { label: "Зеленый", value: "green" },
        { label: "Желтый", value: "yellow" },
      ],
      admin: {
        description: "Выберите цвет заголовка",
      },
    },
  ],
}
