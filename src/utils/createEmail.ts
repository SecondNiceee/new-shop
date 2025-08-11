interface ICreateEmail {
  userEmail: string;
  mode: 'verify' | 'forgetPassword';
  url: string; // теперь обязательный — иначе зачем шаблон?
}

export const createEmail = ({ mode, userEmail, url }: ICreateEmail) => {
  const title = mode === 'verify'
    ? 'Подтвердите ваш email'
    : 'Восстановление пароля';

  const intro = mode === 'verify'
    ? 'Чтобы завершить регистрацию, перейдите по ссылке ниже:'
    : 'Чтобы восстановить пароль, перейдите по ссылке ниже:';

  const buttonText = mode === 'verify'
    ? 'Подтвердить email'
    : 'Восстановить пароль';

  const expires = 'Ссылка действует 24 часа.';

  return {
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">${title}</h1>
          <p>Здравствуйте, ${userEmail}!</p>
          <p>${intro}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${url}" 
              target="_blank" 
              style="background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;"
            >
              ${buttonText}
            </a>
          </div>
          <p><small style="color: #777;">${expires}</small></p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #777;">
            Если вы не регистрировались у нас, просто проигнорируйте это письмо.
          </p>
        </body>
      </html>
    `.replace(/\n\s*/g, ''),
    text: `
      ${title}

      Здравствуйте, ${userEmail}!

      ${intro}

      Перейдите по ссылке:
      ${url}

      Ссылка действует 24 часа.

      Если вы не регистрировались — проигнорируйте это письмо.
    `.trim(),
  };
};