import type { Access, CollectionConfig } from 'payload';

const isLoggedIn: Access = ({ req }) => {
  return !!req.user;
};

const readOwnCart: Access = ({ req }) => {
  if (!req.user) return false;
  return {
    user: {
      equals: req.user.id,
    },
  };
};

const deleteOwnCart: Access = ({ req }) => {
  if (!req.user) return false;
  return {
    user: {
      equals: req.user.id,
    },
  };
};

const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'updatedAt'],
  },
  access: {
    read: readOwnCart,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: deleteOwnCart,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data;
        if (!req.user) {
          throw new Error('Not authorized');
        }
        if (!data.user) {
          data.user = req.user;
        } else {
          const userId = typeof data.user === 'number' ? data.user : data.user?.id;
          if (userId !== req.user.id) {
            throw new Error('Invalid user for cart');
          }
        }
        return data;
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        if (!req.user) {
          throw new Error('Not authorized');
        }
        if (operation === 'update') {
          const originalUserId = typeof originalDoc.user === 'number' ? originalDoc.user : originalDoc.user?.id;
          if (originalUserId !== req.user.id) {
            throw new Error('You can update only your cart');
          }
          const newUserId = typeof data.user === 'number' ? data.user : data.user?.id;
          if (newUserId && newUserId !== originalUserId) {
            throw new Error('Cannot change cart owner');
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        description: 'Cart owner (auto-assigned)',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description: 'Items in cart',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
      ],
    },
  ],
};

export default Carts;