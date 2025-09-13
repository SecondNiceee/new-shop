import { isAccess } from "@/utils/accessUtils"
import type { CollectionConfig } from "payload"

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    group : "Страницы"
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === "admin") {
        return true
      }
      return {
        _status: {
          equals: "published",
        },
      }
    },
    create : isAccess("pages"),
    delete : isAccess("pages"),
    update : isAccess("pages")
  },
  hooks: {
    afterChange: [
      ({ data }) => {
        return data
      }
    ]
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name : "slug",
      type : "text",
      label: "URL-адрес",
      required : true,
      admin : { 
        description : "Уникальный slug, не менять!"
       },
    },
    {
      name : "title",
      type : "text",
      label: "Заголовок",
      required : true,
      admin : {
        description : "Название странички (в поисковике будет)"
      }
    },
    {
      name : "description",
      type : "text",
      label: "Описание",
      required : true,
      admin : {
        description : "Описание, которое в поисковике."
      }
    },
    {
      name : "content",
      type : "richText",
      label: "Контент",
      required : true,
      admin : {
        description : "Это контент страницы"
      }
    }
  ],
}
