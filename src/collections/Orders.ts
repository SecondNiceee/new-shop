import { isAdmin, isLoggedIn, isOwn } from "@/utils/accessUtils"
import type { CollectionConfig } from "payload"


const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "user", "status", "totalAmount", "createdAt"],
  },
  access: {
    read: isOwn,
    create: isLoggedIn,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (!data) return data
        if (!req.user) throw new Error("Not authorized")

        // Auto-assign user on create
        if (operation === "create" && !data.user) {
          data.user = req.user.id
        }

        // Prevent non-admins from assigning orders to others
        if (operation === "create" && req.user.role !== "admin") {
          const userId = typeof data.user === "number" ? data.user : data.user?.id
          if (userId && userId !== req.user.id) {
            throw new Error("You can only create orders for yourself")
          }
        }

        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        // Generate order number only on create
        if (operation === "create" && !data.orderNumber) {
          data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }

        // Prevent changing owner of existing order
        if (operation === "update" && originalDoc) {
          const originalUserId = typeof originalDoc.user === "object"
            ? originalDoc.user.id
            : originalDoc.user

          const newUserId = typeof data.user === "object"
            ? data.user.id
            : data.user

          if (newUserId && newUserId !== originalUserId) {
            throw new Error("Cannot change order owner after creation")
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: "Unique order identifier (auto-generated)",
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        readOnly: true,
        description: "Order owner (auto-assigned)",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        {
          label: "Ожидает обработки",
          value: "pending",
        },
        {
          label: "Готовится",
          value: "preparing",
        },
        {
          label: "В доставке",
          value: "delivering",
        },
        {
          label: "Доставлен",
          value: "delivered",
        },
        {
          label: "Отменен",
          value: "cancelled",
        },
      ],
    },
    {
      name: "items",
      type: "array",
      required: true,
      admin: {
        description: "Order items",
      },
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
        },
        {
          name: "price",
          type: "number",
          required: true,
          admin: {
            description: "Price at the time of order",
          },
        },
      ],
    },
    {
      name: "deliveryAddress",
      type: "group",
      required: true,
      fields: [
        {
          label : "Полный адресс, включа улицу и дом",
          name: "address",
          type: "text",
          required: true,
        },
        {
          label : "Квартира",
          name: "apartment",
          type: "text",
        },
        {
          label : "Подъезд(вхож)",
          name: "entrance",
          type: "text",
        },
        {
          label : "Этаж",
          name: "floor",
          type: "text",
        },
        {
          label : "Комментарий к доставке",
          name: "comment",
          type: "textarea",
        },
      ],
    },
    {
      name: "customerPhone",
      type: "text",
      required: true,
      admin: {
        description: "Customer phone number",
      },
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
      admin: {
        description: "Total order amount including delivery",
      },
    },
    {
      name: "deliveryFee",
      type: "number",
      required: true,
      defaultValue: 199,
      admin: {
        description: "Delivery fee",
      },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description: "Additional notes or comments",
      },
    },
  ],
}

export default Orders