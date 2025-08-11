import { request } from '@/utils/request';
import React, { FC, useCallback, useState } from 'react';

interface IForgotPassword{
    token : string
}
const ForgotPassword:FC<IForgotPassword> = ({token}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [password, setPassword] = useState<string>("")
    const resetPassword = useCallback(async () => {
        setLoading(true);
        try{
            await request({url : "/api/users/reset-password", method : "POST",
                body : {token, password}
            })
        }
        catch(e){
            setError("Не удалось изменить пароль.")
        }
        finally{
            setLoading(false);
        }
    }, [] )
    return (
        <>
        <input onChange={(e) => {setPassword(e.target.value)}} type="password"  />
        <button onClick={resetPassword}>Сохранить пароль</button>
        </>
    );
};

export default ForgotPassword;