import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

const YOOKASSA_API_KEY = "test_oEvHlfzaWS5nQnKnzgjoM5vEQcuI_UZp5zMTo140uRw"
const YOOKASSA_SHOP_ID = 1145015 // You'll need to get this from YooKassa dashboard
export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json()

    // Create idempotence key for YooKassa
    const idempotenceKey = uuidv4()

    // Prepare payment data for YooKassa
    const paymentData = {
      amount: {
        value: orderData.totalAmount.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/payment/success`,
      },
      capture: true,
      description: `Заказ на сумму ${orderData.totalAmount} ₽`,
      metadata: {
        orderData: JSON.stringify(orderData),
      },
    }

    // Create payment in YooKassa
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
