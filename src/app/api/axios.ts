import axios from 'axios';
import store from '@/store';
import { logout } from '@/store/slices/authSlice';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // Criar uma instância separada para o OAuth2, sem baseURL
                    const oauthApi = axios.create();

                    // Requisição para o endpoint de refresh do OAuth2
                    const { data } = await oauthApi.post('http://localhost:8000/api/v1/o/token/', {
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,  // Adicionar o client_id
                        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,  // Adicionar o client_secret
                    });

                    // Atualiza o token de acesso no localStorage e nos headers
                    localStorage.setItem('accessToken', data.access_token);
                    api.defaults.headers.Authorization = `Bearer ${data.access_token}`;
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

                    // Reenvia a requisição original com o novo token de acesso
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
