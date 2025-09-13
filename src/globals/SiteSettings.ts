import type { GlobalConfig } from "payload"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access : {
    read : () => true,
    update : () => true
  },
  admin: {
    group: "Настройки сайта",
    description: "Основные настройки сайта и контактная информация",
  },
  fields: [
    {
      name: "companyInfo",
      type: "group",
      label: "Информация о компании",
      admin: {
        description: "Основная информация о вашей компании",
      },
      required:true,
      fields: [
        { 
          name: "legalName",
          type: "text",
          label: "Юридическое название",
          required: true,
          defaultValue: 'ООО "ГРАНДБАЗАР"',
          admin: {
            description: "Полное юридическое название компании",
          },
        },
        {
          name: "year",
          type: "number",
          label: "Год основания",
          required: true,
          defaultValue: new Date().getFullYear(),
          admin: {
            description: "Год основания компании",
          },
        },
        {
          name:"phone",
          required : true,
          type : 'text',
          label: "Телефон",
          defaultValue : "+7 968 784 58 54",
          admin: {
            description: "Основной контактный телефон компании",
          },
        }
      ],
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Ссылки на социальные сети",
      admin: {
        description: "Ссылки на ваши социальные сети и мессенджеры",
      },
      required:true,
      fields: [
        {
            name: "email",
            type: "text",
            label: "Email",
            required: false,
            defaultValue: "Ваш Email",
            admin: {
              description: "Контактный email адрес",
            },         
        },
        {
            name: "whatsApp",
            type: "text",
            label: "WhatsApp",
            required: false,
            defaultValue: "ссылка на ваш ватсапп акк",
            admin: {
              description: "Ссылка на WhatsApp (номер телефона или ссылка)",
            },  
        },
        {
          name: "vk",
          type: "text",
          label: "VK",
          required: false,
          defaultValue: "https://vk.com/grandbazar",
          admin: {
            description: "Ссылка на страницу ВКонтакте",
          },
        },
        {
          name: "telegram",
          type: "text",
          label: "Telegram",
          required: false,
          defaultValue: "https://t.me/grandbazar",
          admin: {
            description: "Ссылка на Telegram канал или бот",
          },
        },
        {
          name: "youtube",
          type: "text",
          label: "YouTube",
          required: false,
          defaultValue: "https://youtube.com/@grandbazar",
          admin: {
            description: "Ссылка на YouTube канал",
          },
        },
        {
          name: "instagram",
          type: "text",
          label: "Instagram",
          required: false,
          defaultValue: "https://instagram.com/grandbazar",
          admin: {
            description: "Ссылка на Instagram профиль",
          },
        },
      ],
    },
  ],
}
