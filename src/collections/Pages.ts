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
      required : true,
      admin : { 
        description : "Уникальный slug, не менять!"
       },
    },
    {
      name : "title",
      type : "text",
      required : true,
      admin : {
        description : "Название странички (в поисковике будет)"
      }
    },
    {
      name : "description",
      type : "text",
      required : true,
      admin : {
        description : "Описание, которое в поисковике."
      }
    },
    {
      name : "content",
      type : "richText",
      required : true,
      admin : {
        description : "Это контент страницы"
      }
    }
  ],
}
