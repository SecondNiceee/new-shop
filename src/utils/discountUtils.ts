import { Product } from "@/payload-types"

type TDiscount =  {
    isActive?: boolean | null | undefined;
    type?: "percentage" | "fixed" | null | undefined;
    value?: number | null | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    description?: string | null | undefined;
} | undefined

/**
 * Проверяет, активна ли скидка в данный момент
 */
export const isDiscountActive = (discount?: TDiscount): boolean => {
  if (!discount || !discount.isActive || !discount.value) {
    return false
  }

  const now = new Date()

  // Проверяем дату начала скидки
  if (discount.startDate) {
    const startDate = new Date(discount.startDate)
    if (now < startDate) {
      return false
    }
  }

  // Проверяем дату окончания скидки
  if (discount.endDate) {
    const endDate = new Date(discount.endDate)
    if (now > endDate) {
      return false
    }
  }

  return true
}

/**
 * Рассчитывает размер скидки в рублях
 */
export const calculateDiscountAmount = (price: number, discount?: TDiscount): number => {
  if (!isDiscountActive(discount)) {
    return 0
  }
  if (discount!.type === "percentage") {
    return Math.round((price * (discount?.value as number)) / 100)
  } else {
    // Фиксированная скидка не может быть больше цены товара
    return Math.min((discount?.value as number), price)
  }
}

/**
 * Рассчитывает финальную цену товара с учетом скидки
 */
export const calculateDiscountedPrice = (price: number, discount?: TDiscount): number => {
  const discountAmount = calculateDiscountAmount(price, discount)
  return Math.max(0, price - discountAmount)
}

/**
 * Возвращает информацию о скидке для отображения
 */
export const getDiscountInfo = (product: Product) => {
  const { price, discount } = product;
  console.log(product);    

  if (!isDiscountActive(discount)) {
    return {
      hasDiscount: false,
      originalPrice: price,
      discountedPrice: price,
      discountAmount: 0,
      discountPercentage: 0,
      discountType: null,
    }
  }

  const discountAmount = calculateDiscountAmount(price, discount)
  const discountedPrice = calculateDiscountedPrice(price, discount)
  const discountPercentage = Math.round((discountAmount / price) * 100)

  return {
    hasDiscount: true,
    originalPrice: price,
    discountedPrice,
    discountAmount,
    discountPercentage,
    discountType: discount!.type,
  }
}

/**
 * Форматирует цену для отображения
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
