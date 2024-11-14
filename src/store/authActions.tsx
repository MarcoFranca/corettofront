import api from '@/app/api/axios';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import qs from 'qs';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

export const logout = () => async (dispatch: AppDispatch) => {
    const refreshToken = localStorage.getItem('refreshToken');
    dispatch(logoutAction()); // Atualiza o estado de logout antes de revogar o token

    if (refreshToken) {
        const requestBody = qs.stringify({
            token: refreshToken,
            token_type_hint: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        try {
            await api.post('/o/revoke_token/', requestBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            console.log('Token revogado com sucesso');
        } catch (error) {
            console.error('Erro ao revogar o token:', error);
        }
    }
};
