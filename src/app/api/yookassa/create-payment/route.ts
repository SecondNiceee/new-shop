import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"

const YOOKASSA_API_KEY = process.env.YOOKASSA_API_KEY!
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID!

export async function POST(req: NextRequest) {
  try {
    // 1. Получаем тело запроса
    const orderData = await req.json()

    // 2. Получаем куки и извлекаем payload-token
    const cookieStore = await cookies()
    const payloadCookie = cookieStore.get('payload-token')

    if (!payloadCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 3. Запрашиваем данные пользователя из Payload
    const userRes = await fetch(`${process.env.BACKEND_URL}/api/users/me?select[id]=true`, {
      method: "GET",
      headers: {
        Cookie: `payload-token=${payloadCookie.value}`,
      },
      cache: "no-store",
    })

    if (!userRes.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await userRes.json()
    const userId = userData.user?.id;
    console.log(userId);
    console.log(userData);

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 4. Добавляем userId в orderData
    const enrichedOrderData = {
      ...orderData,
      user : userId, // ← вот он!
    }

    // 5. Генерируем ключ идемпотентности
    const idempotenceKey = uuidv4()

    // 6. Подготавливаем данные платежа
    const paymentData = {
      amount: {
        value: enrichedOrderData.totalAmount.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/payment/success`,
      },
      capture: true,
      description: `Заказ на сумму ${enrichedOrderData.totalAmount} ₽`,
      metadata: {
        orderData: JSON.stringify(enrichedOrderData), // ← теперь с userId
      },
    }

    // 7. Отправляем в ЮKassa
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        Authorization: `Basic ${Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_API_KEY}`).toString("base64")}`,
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("YooKassa error:", errorData)
      throw new Error("Failed to create payment")
    }

    const payment = await response.json()
    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}