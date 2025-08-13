import {z} from "zod";
import { emailSchema, passwordSchema } from "./validation-constants";
export const registrationSchema = z.object({
    email : emailSchema,
    password : passwordSchema
})

export const loginSchema = z.object({
    email : emailSchema,
    password : z.string().min(1, "Пароль обязателен")
})