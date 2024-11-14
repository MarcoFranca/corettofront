import axios from 'axios';
import store from '@/store';
import { logout, updateAccessToken } from '@/store/slices/authSlice';

// Cria uma instância do axios com a URL base
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Interceptador de requisições para adicionar o token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptador de respostas para lidar com erros 401 e atualizar o token automaticamente
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se receber 401 e ainda não tentou novamente
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/o/token/`, {
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
                    });

                    const newAccessToken = data.access_token;

                    // Atualize o token no localStorage e Redux
                    localStorage.setItem('accessToken', newAccessToken);
                    api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    store.dispatch(updateAccessToken(newAccessToken));

                    return api(originalRequest);
                } catch (err) {
                    store.dispatch(logout());
                    return Promise.reject(err);
                }
            }
        }

        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
