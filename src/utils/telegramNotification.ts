interface OrderData {
  orderNumber: string
  user?: {
    email?: string
  } | string
  customerPhone: string
  items?: Array<{
    product?: {
      title?: string
    } | string
    quantity: number
    price: number
  }>
  deliveryAddress?: {
    address?: string
    apartment?: string
    entrance?: string
    floor?: string
    comment?: string
  }
  totalAmount: number
  deliveryFee: number
  notes?: string
}

export function formatOrderMessage(orderData: Partial<OrderData>): string {
  // Get user info if available
  let userName = 'Неизвестный пользователь'
  if (orderData.user && typeof orderData.user === 'object' && orderData.user.email) {
    userName = orderData.user.email
  }

  // Format order items
  const itemsText = orderData.items?.map((item) => {
    const productName = typeof item.product === 'object' ? item.product.title : 'Товар'
    return `• ${productName} x${item.quantity} - ${item.price}₽`
  }).join('\n') || 'Нет товаров'

  // Format delivery address
  const address = orderData.deliveryAddress
  const fullAddress = [
    address?.address,
    address?.apartment && `кв. ${address.apartment}`,
    address?.entrance && `подъезд ${address.entrance}`,
    address?.floor && `этаж ${address.floor}`
  ].filter(Boolean).join(', ')

  return `🛒 *Новый заказ!*

📋 *Номер заказа:* ${orderData.orderNumber || 'Не указан'}
👤 *Покупатель:* ${userName}
📞 *Телефон:* ${orderData.customerPhone || 'Не указан'}

📦 *Товары:*
${itemsText}

📍 *Адрес доставки:* ${fullAddress}
${address?.comment ? `💬 *Комментарий:* ${address.comment}` : ''}

💰 *Сумма заказа:* ${orderData.totalAmount || 0}₽
🚚 *Доставка:* ${orderData.deliveryFee || 0}₽
${orderData.notes ? `📝 *Примечания:* ${orderData.notes}` : ''}

🕐 *Время заказа:* ${new Date().toLocaleString('ru-RU')}`
}
