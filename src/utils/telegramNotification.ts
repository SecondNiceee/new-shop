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

  // Get backend URL from environment
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
  const orderId = (orderData as any).id || 'unknown'
  
  // Ensure URL is properly formatted for Telegram
  let adminOrderUrl = `${backendUrl}/admin/collections/orders/${orderId}`
  
  // For localhost or non-HTTPS URLs, we'll just show the URL as text
  const isLocalhost = adminOrderUrl.includes('localhost') || adminOrderUrl.includes('127.0.0.1')
  const isHttps = adminOrderUrl.startsWith('https://')

  console.log('Backend URL:', backendUrl);
  console.log('Order ID:', orderId);
  console.log('Admin Order URL:', adminOrderUrl);
  console.log('Is localhost:', isLocalhost);
  console.log('Is HTTPS:', isHttps);

  // Format the link based on URL type
  let linkText = ''
  if (isLocalhost || !isHttps) {
    // For localhost or HTTP URLs, show as plain text
    linkText = `🔗 *Ссылка на заказ:* ${adminOrderUrl}`
  } else {
    // For HTTPS URLs, show as clickable link
    linkText = `🔗 [Открыть заказ в админке](${adminOrderUrl})`
  }

  // Escape special characters for MarkdownV2
  const escapeMarkdown = (text: string) => {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
  }

  return `🛒 *Новый заказ\\!*

📋 *Номер заказа:* ${escapeMarkdown(orderData.orderNumber || 'Не указан')}
👤 *Покупатель:* ${escapeMarkdown(userName)}
📞 *Телефон:* ${escapeMarkdown(orderData.customerPhone || 'Не указан')}

📦 *Товары:*
${escapeMarkdown(itemsText)}

📍 *Адрес доставки:* ${escapeMarkdown(fullAddress)}
${address?.comment ? `💬 *Комментарий:* ${escapeMarkdown(address.comment)}` : ''}

💰 *Сумма заказа:* ${orderData.totalAmount || 0}₽
🚚 *Доставка:* ${orderData.deliveryFee || 0}₽
${orderData.notes ? `📝 *Примечания:* ${escapeMarkdown(orderData.notes)}` : ''}

🕐 *Время заказа:* ${escapeMarkdown(new Date().toLocaleString('ru-RU'))}

${linkText}`

}
