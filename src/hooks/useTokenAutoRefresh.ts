import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateAccessToken, logout } from '@/store/slices/authSlice';
import axios from 'axios';

export const useTokenAutoRefresh = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = setInterval(async () => {
            const expiresAt = Number(localStorage.getItem('accessTokenExpiresAt'));
            const refreshToken = localStorage.getItem('refreshToken');

            if (!expiresAt || !refreshToken) return;

            const now = Date.now();
            const FIVE_MINUTES = 5 * 60 * 1000;

            if (expiresAt - now <= FIVE_MINUTES) {
                try {
                    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token/`, {
                        refresh_token: refreshToken
                    });

                    console.log('[AutoRefresh] expiresAt:', new Date(expiresAt), '| agora:', new Date(now));

                    localStorage.setItem('accessToken', data.access_token);
                    localStorage.setItem('accessTokenExpiresAt', (Date.now() + data.expires_in * 1000).toString());
                    dispatch(updateAccessToken(data.access_token));
                } catch (error) {
                    console.error('Erro ao renovar token preventivamente:', error);
                    dispatch(logout());
                }
            }
        }, 60000); // checa a cada 1 minuto

        return () => clearInterval(interval);
    }, [dispatch]);
};
