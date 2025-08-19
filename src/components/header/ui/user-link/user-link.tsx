'use client'
import React, { FC } from 'react';
import { Button } from '../../../ui/button';
import { User } from 'lucide-react';
import { useAuthStore } from '@/entities/auth/authStore';
import { useAuthDialogStore } from '@/entities/auth/authDialogStore';
import { useRouter } from 'next/navigation';
import { routerConfig } from '@/config/router.config';

interface IUserLink{
    className?:string
}
const UserLink:FC<IUserLink> = ({className = ""}) => {
    const {user} = useAuthStore();
    const {openDialog} = useAuthDialogStore();
    const router = useRouter();
    console.log(user);
    const clickHandler = () => {
        if (user){
            router.push(`${routerConfig.profile}`)
        }
        else{
            openDialog("login");
        }
    }
    return (
        <Button
        variant="default"
        size="sm"
        onClick={clickHandler}
        className={`p-2 bg-green-400 hover:bg-green-300 rounded-full ${className}`}
        >
        <User className="h-4 w-4 text-white" />
        </Button>
    );
};

export default UserLink;