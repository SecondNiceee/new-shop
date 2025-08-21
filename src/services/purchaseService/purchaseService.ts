import { request } from "@/utils/request"

class PurchaseService {
  async checkPurchase(productId: number): Promise<{ hasPurchased: boolean; message: string }> {
    const response = await request<{ hasPurchased: boolean; message: string }>({
      url: "/api/check-purchase",
      method: "POST",
      body: { productId },
      credentials: true,
    })
    return response
  }
}

export const purchaseService = new PurchaseService()
