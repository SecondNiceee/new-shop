import { createEmail } from "@/utils/createEmail"
import type { CollectionConfig, PayloadRequest } from "payload"
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: () => true,
    admin : ({req : {user}}) => {
      return Boolean(user?.role === "admin")
    }
  },
  auth: {
    forgotPassword: {
      expiration: 1000 * 60 * 20,
      generateEmailHTML: (args) => {
        const typedArgs = args as {
          req?: PayloadRequest | undefined
          token?: string
          user?: any
        }
        const { token, user } = typedArgs
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/forgotPassword?token=${token}`
        return createEmail({ mode: "forgetPassword", url, userEmail: user.email }).html
      },
    },
    tokenExpiration: Number(process.env.AUTH_TOKEN_EXPIRATION) || 60 * 60 * 24 * 7, // 7 дней в секундах
    verify: {
      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify?token=${token}`
        return createEmail({ mode: "verify", url: url, userEmail: user?.email }).html
      },
    },
    maxLoginAttempts: 5,
    lockTime: 6000,
    cookies: {
      sameSite: "Lax",
      secure: false, // Отключаем для разработки
      domain: undefined, // Убираем domain для localhost
    },
  },
  hooks: {},
  
  fields: [
    // Email added by default
    {
      name: "phone",
      type: "text",
      label: "Phone",
      required: false,
      admin: {
        description: "Phone number for delivery contact",
      },
      validate: (value: string | string[] | null | undefined) => {
        if (!value) return true; // null, undefined, пустая строка — ок (по твоей логике)

        // Если это массив — можно отклонить или взять первый элемент — зависит от контекста
        // Допустим, мы ожидаем строку, а не массив
        if (Array.isArray(value)) {
          // console.log("Error here")
          return "Телефон должен быть строкой, а не массивом";
        }

        // Теперь TypeScript знает, что value — string
       const phoneRegex = /^8\d{10}$/;
        console.log(value);
        if (!phoneRegex.test(value)) {
          console.log("Error here")
           return "Invalid phone format. Use format: +7 (XXX) XXX-XX-XX" 
        }

        return true;
      }
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Manager', value: 'manager' },
      ],
      defaultValue: 'user',
      access: {
        read: () => true,
        create: () => false,
        update: () => true, // только админ может менять роли
      },
      admin: {
        position: 'sidebar',
      },
    },
    // Add more fields as needed
  ],
}
