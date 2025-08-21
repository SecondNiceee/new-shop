import { isLoggedIn, isOwn } from "@/utils/accessUtils"
import { beforeValidateHook } from "@/utils/beforeValidateHook"
import type { CollectionConfig } from "payload"

const Favorites: CollectionConfig = {
  slug: "favorites",
  admin: {
    useAsTitle: "product",
  },
  access: {
    read: isOwn,
    create: isLoggedIn,
    update: isOwn,
    delete: isOwn
  },
  hooks : {
    beforeValidate : [
        beforeValidateHook
    ]
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      label: "Users",
      relationTo: "users",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "product",
      type: "relationship",
      label: "Product",
      relationTo: "products",
      required: true,
    }
  ],
  // Уникальная комбинация пользователь + товар

}

export default Favorites
