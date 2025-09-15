import { isAccess, isAdmin, isLoggedIn, isOwn } from "@/utils/accessUtils"
import { formatOrderMessage } from "@/utils/telegramNotification"
import type { CollectionConfig } from "payload"


const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    group : "Заказы(Важно)",
    defaultColumns: ["orderNumber", "user", "status", "totalAmount", "createdAt"],
  },
  access: {
    read: isOwn,
    create: isLoggedIn,
    update: isAccess("orders"),
    delete: isAccess("orders"),
  },
  hooks: {
    afterChange: [
      async ({  operation, doc }) => {
        console.log("Выполняется после изменения");
        // Send Telegram notification only for new orders
        if (operation === 'create' && doc) {
          try {
            const botToken = process.env.TELEGRAM_BOT_TOKEN
            const channelId = process.env.TELEGRAM_CHANNEL_ID
            
            if (!botToken || !channelId) {
              console.warn('Telegram bot credentials not configured')
              return
            }

            const message = formatOrderMessage(doc)
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
            
            const response = await fetch(telegramUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: channelId,
                text: message,
                parse_mode: 'MarkdownV2',
              }),
            })

            if (!response.ok) {
              console.error('Failed to send Telegram notification:', await response.text())
            } else {
              console.log('Telegram notification sent successfully')
            }
          } catch (error) {
            console.error('Error sending Telegram notification:', error)
          }
        }
      }
    ],
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
      label: "Номер заказа",
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
      label: "Пользователь",
      required: true,
      admin: {
        readOnly: true,
        description: "Order owner (auto-assigned)",
      },
    },
    {
      name: "status",
      type: "select",
      label: "Статус",
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
      label: "Товары в заказе",
      required: true,
      admin: {
        description: "Order items",
      },
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          label: "Товар",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          label: "Количество",
          required: true,
          min: 1,
        },
        {
          name: "price",
          type: "number",
          label: "Цена",
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
      label: "Телефон клиента",
      required: true,
      admin: {
        description: "Customer phone number",
      },
    },
    {
      name: "totalAmount",
      type: "number",
      label: "Общая сумма",
      required: true,
      admin: {
        description: "Total order amount including delivery",
      },
    },
    {
      name: "deliveryFee",
      type: "number",
      label: "Стоимость доставки",
      required: true,
      defaultValue: 199,
      admin: {
        description: "Delivery fee",
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: "Примечания",
      admin: {
        description: "Additional notes or comments",
      },
    },
  ],
}

export default Orders