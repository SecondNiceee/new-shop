import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (req: NextRequest) => {
  const payload = await getPayload({ config })
  const headers = req.headers
  const user = await payload.auth({ headers })
  if (!user.user){
    return NextResponse.json({message : "Not Authorized"}, {status : 403})
  }
  try {
    const favoritiesIds = await payload.find({
      collection: 'favorites',
      depth: 0,
      limit : 0,
      select: {
        product: true,
      },
      user : user.user
    })
    return NextResponse.json({ docs: favoritiesIds.docs }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Не удалось загрузить избранные' }, { status: 500 })
  }
}
