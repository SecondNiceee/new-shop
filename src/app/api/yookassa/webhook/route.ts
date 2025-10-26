import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const webhookData = await req.json()

    console.log("[v0] YooKassa webhook received:", webhookData)

    // Check if payment is successful
    if (webhookData.event === "payment.succeeded") {
      const paymentObject = webhookData.object

      // Extract order data from metadata
      const orderData = JSON.parse(paymentObject.metadata.orderData)

      // Create order in database
      const order = await payload.create({
        collection: "orders",
        data: {
          ...orderData,
          status: "pending",
          paymentId: paymentObject.id,
          paymentStatus: "paid",
        },
        overrideAccess : true
      })

      console.log("[v0] Order created:", order.id)

      return NextResponse.json({ success: true })
    }

    // Handle payment cancellation
    if (webhookData.event === "payment.canceled") {
      console.log("[v0] Payment canceled:", webhookData.object.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
