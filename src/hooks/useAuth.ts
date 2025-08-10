import { routerConfig } from '@/config/router.config';
import { useAuthDialogStore } from '@/entities/auth/authDialogStore';
import { TUserResponse, useAuthStore } from '@/entities/auth/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useAuth = () => {
  const router = useRouter();
  const { user, loading, logout, fetchMe } = useAuthStore();
  const openDialog = useAuthDialogStore((s) => s.openDialog);
  // Этого достаточно, юзер загружается сразу в init-app, если он не заггрузился там, он ниоткуда не появится.
  useEffect(() => {
    if (user === null) {
        fetchMe().then((user : TUserResponse) => {
            if (!user.user){
                router.replace(routerConfig.home);
            }
        })
    }
  }, [user, fetchMe, openDialog, router])
  return {user, loading, logout}
};

export default useAuth;