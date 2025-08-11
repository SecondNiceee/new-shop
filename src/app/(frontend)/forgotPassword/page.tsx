import { getPayload } from 'payload';
import React, { FC } from 'react';
import config from "@payload-config";

interface IForgotPassword{
    searchParams : {
        token : string
    }
}
const ForgotPasswordPage:FC<IForgotPassword> = async ({searchParams}) => {
    const token = (await searchParams).token;
    if (!token) {
        return (
        <div>
            ❌ Неверная ссылка: отсутствует токен.
        </div>
        );
    }
    return (
        <ForgotPasswordPage searchParams={searchParams} />
    );
};

export default ForgotPasswordPage;