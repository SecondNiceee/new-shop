import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { cookies } from "next/headers"

// POST - добавить товар в избранное
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { productId } = await request.json()
    console.log(productId)

    // Получаем пользователя из cookies
    const cookieStore = await cookies()
    const payloadCookie = cookieStore.get('payload-token');
  
    if (!payloadCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const userData = await userRes.json();
    const user = userData.user;
    console.log(user);

    if (!user) {
      return NextResponse.json({ error: "Необходимо войти в систему" }, { status: 401 })
    }

    if (!productId) {
      return NextResponse.json({ error: "ID товара не указан" }, { status: 400 })
    }
    // Добавляем товар в избранное
    const favorite = await payload.create({
      collection: "favorites",
      user,
      data: {
        user: user.id,
        product: productId
      },
      select : {product : true},
      depth : 2,
      overrideAccess: true,
    })

    return NextResponse.json(
      {
        doc:favorite,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Ошибка добавления в избранное:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
