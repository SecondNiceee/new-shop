import type { CollectionConfig } from 'payload';
import { refresh } from '@payloadcms/next/auth';
import config from '@payload-config'
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration : 604800,
    verify : true,
    maxLoginAttempts : 5,
    lockTime : 6000,
    cookies : {sameSite : "Lax", secure : true},
  },
  hooks : {},
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
