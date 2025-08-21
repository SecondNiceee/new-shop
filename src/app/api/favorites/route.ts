import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"

// GET - получить избранные товары пользователя с пагинацией
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Получаем пользователя из cookies
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: "Необходимо войти в систему" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Получаем избранные товары пользователя с пагинацией
    const favorites = await payload.find({
      collection: "favorites",
      where: {
        user: { equals: user.id },
      },
      depth: 2, // Подгружаем связанные товары
      sort: "-createdAt",
      page,
      limit,
      overrideAccess: true,
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Ошибка получения избранного:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
