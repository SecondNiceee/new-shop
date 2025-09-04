import type { GlobalConfig } from "payload"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Настройки сайта",
  },
  fields: [
    {
      name: "companyInfo",
      type: "group",
      label: "Информация о компании",
      required:true,
      fields: [
        { 
          name: "legalName",
          type: "text",
          label: "Юридическое название",
          required: true,
          defaultValue: 'ООО "ГРАНДБАЗАР"',
        },
        {
          name: "year",
          type: "number",
          label: "Год основания",
          required: true,
          defaultValue: new Date().getFullYear(),
        },
        {
          name:"phone",
          required : true,
          type : 'text',
          defaultValue : "+7 968 784 58 54",
          
        }
      ],
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Ссылки на социальные сети",
      required:true,
      fields: [
        {
          name: "vk",
          type: "text",
          label: "VK",
          required: false,
          defaultValue: "https://vk.com/grandbazar",
        },
        {
          name: "telegram",
          type: "text",
          label: "Telegram",
          required: false,
          defaultValue: "https://t.me/grandbazar",
        },
        {
          name: "youtube",
          type: "text",
          label: "YouTube",
          required: false,
          defaultValue: "https://youtube.com/@grandbazar",
        },
        {
          name: "instagram",
          type: "text",
          label: "Instagram",
          required: false,
          defaultValue: "https://instagram.com/grandbazar",
        },
      ],
    },
  ],
}
