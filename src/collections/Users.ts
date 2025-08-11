import { createEmail } from '@/utils/createEmail'
import type { CollectionConfig, PayloadRequest } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
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
        const {token, user} = typedArgs
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/forgotPassword?token=${token}`
        return createEmail({ mode: 'forgetPassword', url, userEmail: user.email }).html;
      },
    },
    tokenExpiration: 604800,
    verify: {
      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify?token=${token}`
        return createEmail({ mode: 'verify', url: url, userEmail: user?.email }).html
      },
    },
    maxLoginAttempts: 5,
    lockTime: 6000,
    cookies: { sameSite: 'Lax', secure: true },
  },
  hooks: {},
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
