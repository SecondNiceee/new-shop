import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getUserFromCookie } from '@/utils/getUserFromCookie'

export const GET = async () => {
  const payload = await getPayload({ config })
  const user = await getUserFromCookie();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const favoritiesIds = await payload.find({
      collection: 'favorites',
      depth: 0,
      limit: 0,
      select: {
        product: true,
      },
      user: user.id,
      where: {
        user: { equals: user.id },
      },
    })
    console.log(favoritiesIds);
    return NextResponse.json({ docs: favoritiesIds.docs }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Не удалось загрузить избранные' }, { status: 500 })
  }
}
