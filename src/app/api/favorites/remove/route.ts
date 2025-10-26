import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { getUserFromCookie } from "@/utils/getUserFromCookie"

// DELETE - удалить товар из избранного
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { productId } = await request.json()

    // Получаем пользователя из cookies
    const user = await getUserFromCookie()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!productId) {
      return NextResponse.json({ error: "ID товара не указан" }, { status: 400 })
    }

    // Находим запись в избранном
    const existingFavorite = await payload.find({
      collection: "favorites",
      where: {
        and: [{ user: { equals: user.id } }, { product: { equals: productId } }],
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existingFavorite.docs.length === 0) {
      return NextResponse.json({ error: "Товар не найден в избранном" }, { status: 404 })
    }

    // Удаляем из избранного
    await payload.delete({
      collection: "favorites",
      id: existingFavorite.docs[0].id,
      overrideAccess: true,
    })

    return NextResponse.json({
      message: "Товар удален из избранного",
    })
  } catch (error) {
    console.error("Ошибка удаления из избранного:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
