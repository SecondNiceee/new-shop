import { beforeValidateHook } from "@/utils/beforeValidateHook"
import type { Access, CollectionConfig } from "payload"

const isLoggedIn: Access = ({ req }) => {
  return !!req.user
}

const readOwnAddress: Access = ({ req }) => {
  if (!req.user) return false
  return {
    user: {
      equals: req.user.id,
    },
  }
}

const Addresses: CollectionConfig = {
  slug: "addresses",
  admin: {
    useAsTitle: "street",
    defaultColumns: ["street", "user", "updatedAt"],
  },
  access: {
    read: readOwnAddress,
    create: isLoggedIn,
    update: readOwnAddress,
    delete: readOwnAddress,
  },
  hooks: {
    beforeValidate: [
      beforeValidateHook
    ]
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: false,
      unique: true, // Один адрес на пользователя
      admin: {
        readOnly: true,
        description: "Address owner (auto-assigned)",
      },
    },
    {
      name: "street",
      type: "text",
      required: true,
      label: "Адрес",
      admin: {
        description: "Полный адрес улицы",
      },
    },
    {
      name: "apartment",
      type: "text",
      label: "Квартира/Офис",
      required: false,
    },
    {
      name: "entrance",
      type: "text",
      label: "Подъезд",
      required: false,
    },
    {
      name: "floor",
      type: "text",
      label: "Этаж",
      required: false,
    },
    {
      name: "comment",
      type: "textarea",
      label: "Комментарий к доставке",
      required: false,
    },
    {
      name: "coordinates",
      type: "group",
      label: "Координаты",
      fields: [
        {
          name: "lat",
          type: "number",
          label: "Широта",
          required: false,
        },
        {
          name: "lng",
          type: "number",
          label: "Долгота",
          required: false,
        },
      ],
    },
  ],
}

export default Addresses
