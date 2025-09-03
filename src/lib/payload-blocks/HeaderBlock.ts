import type { Block } from "payload"

export const HeaderBlock: Block = {
  slug: "header",
  fields: [
    {
      name: "text",
      type: "text",
      admin: {
        description: "Это текст заголовка",
      },
    },
    {
      name: "level",
      type: "select",
      defaultValue: "h2",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "H4", value: "h4" },
        { label: "H5", value: "h5" },
        { label: "H6", value: "h6" },
      ],
      admin: {
        description: "Выберите уровень заголовка (H1-H6)",
      },
    },
    {
      name: "color",
      type: "select",
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
