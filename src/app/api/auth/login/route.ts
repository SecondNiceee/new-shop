import { emailRegex } from '@/constants/email-schema'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload';
import config from "@payload-config";

export async function POST(req: NextRequest) { 
  console.log("Привет");
  try{
      const { email, password } = await req.json();
      if (!email || !password) {
        return NextResponse.json({ message : 'Email и пароль обязательны' }, { status: 400 })
      }
    
      if (!emailRegex.test(email)) {
        return NextResponse.json({ message : 'Неверный формат email' }, { status: 400 })
      }
      if (password.length < 8) {
        return NextResponse.json({ message : 'Пароль должен быть не менее 8 символов' }, { status: 400 })
      }
      const payload = await getPayload({ config });
      const user = await payload.login({collection : "users", 
        data : {email,password}
      });
      if (!user.user){
        return NextResponse.json({message:"Пользователь с такими данными не найден."}, {status : 500})
      }
      return NextResponse.json(user.user, {status:200})
  }
  catch(error){
    console.log("Попал сюда")
    let message = 'Не удалось войти';
    console.log(error);
    // if (error instanceof Error) {
    //   if (error.message.includes('Invalid login')) {
    //     message = 'Неверный email или пароль';
    //   } else if (error.message.includes('not verified')) {
    //     message = 'Email не подтверждён';
    //   }
    // }
    return NextResponse.json(
      { message },
      { status: 401 }
    );
  }

}
