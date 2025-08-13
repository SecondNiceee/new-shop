// Схема валидации

import z from "zod"

export const addressSchema = z.object({
  street: z.string().min(1, "Это поле обязательное").min(5, "Адрес должен содержать минимум 5 символов"),
  apartment: z.string().optional(),
  entrance: z.string().optional(),
  floor: z.string().optional(),
  comment: z.string().optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>