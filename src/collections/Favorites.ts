import { isLoggedIn, isOwn } from '@/utils/accessUtils'
import { beforeValidateHook } from '@/utils/beforeValidateHook'
import type { CollectionConfig } from 'payload'

const Favorites: CollectionConfig = {
  slug: 'favorites',
  admin: {
    useAsTitle: 'product',
  },
  access: {
    read: isOwn,
    create: isLoggedIn,
    update: isOwn,
    delete: isOwn,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data
        if (!req.user) {
          throw new Error('Not authorized')
        }
        if (!data.user) {
          data.user = req.user.id
        }
        console.log(data)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: 'Users',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'product',
      type: 'relationship',
      label: 'Product',
      relationTo: 'products',
      required: true,
    },
  ],
  indexes: [
    {
      fields: ['user', 'product'],
      unique: true
    },
  ]
  // Уникальная комбинация пользователь + товар
}

export default Favorites
