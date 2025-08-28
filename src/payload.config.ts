// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres"
import { payloadCloudPlugin } from "@payloadcms/payload-cloud"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"
import sharp from "sharp"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import nodemailer from "nodemailer"
import { Users } from "./collections/Users"
import { Media } from "./collections/Media"
import Categories from "./collections/Categories"
import Products from "./collections/Products"
import Carts from "./collections/Carts"
import Addresses from "./collections/Addresses"
import Orders from "./collections/Orders"
import Reviews from "./collections/Reviews"
import Favorites from "./collections/Favorites"
import About from "./globals/About"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const MAIL_NAME = process.env.MAIL_NAME || ""
const MAIL_USER = process.env.MAIL_USER || ""
const MAIL_PASSWORD = process.env.MAIL_PASSWORD || ""

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://5.35.90.170:3000",
  cors: [process.env.PAYLOAD_PUBLIC_URL || "http://5.35.90.170:3000"],
  csrf: [process.env.PAYLOAD_PUBLIC_URL || "http://5.35.90.170:3000"],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Carts, Addresses, Orders, Reviews, Favorites],
  globals: [About],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  endpoints: [],
  email: nodemailerAdapter({
    defaultFromAddress: MAIL_NAME,
    defaultFromName: "ГРАНДБАЗАР",
    transport: nodemailer.createTransport({
      service: "Mail.ru", // ✅ Работает стабильно,
      host: "smtp.mail.ru",
      port: 587,
      secure: false, // ❌ не используй true для порта 587
      requireTLS: true, // ✅ обязателен для Mail.ru
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    }),
  }),
})
