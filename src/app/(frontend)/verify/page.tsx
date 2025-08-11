// app/verify-email/page.tsx
import { getPayload } from 'payload';
import config from '@payload-config';
import { Link } from 'lucide-react';
import { routerConfig } from '@/config/router.config';

type PageProps = {
  searchParams: {
    token?: string;
  };
};

const VerifyEmailPage = async ({ searchParams }: PageProps) => {
  
  const payload = await getPayload({ config });
  const token = (await searchParams).token;

  if (!token) {
    return (
      <div>
        ❌ Неверная ссылка: отсутствует токен.
      </div>
    );
  }

  try {
    // Пытаемся подтвердить email
    await payload.verifyEmail({
      collection: 'users',
      token,
    });

    // ✅ Успех — можно перенаправить или показать сообщение
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ Email подтверждён!</h1>
        <p className="text-gray-700 mt-2">
          Теперь вы можете войти в свой аккаунт.
        </p>
        <a
          href={routerConfig.home}
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Войти
        </a>
      </div>
    );
  } catch (error: unknown) {
    // ⚠️ Ошибка: неверный или просроченный токен
    console.log(error)
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">❌ Ошибка подтверждения</h1>
        <p className="text-gray-700 mt-2">
          Ссылка недействительна или устарела.
        </p>
      </div>
    );
  }
};

export default VerifyEmailPage;