import axios from 'axios';
import store from '@/store';
import { logout } from '@/store/slices/authSlice';

// Instância principal do axios com base na URL do .env
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,  // URL única definida no .env
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
                    const oauthApi = axios.create();

                    const { data } = await oauthApi.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/o/token/`,  // Usando a URL base
                        {
                            grant_type: 'refresh_token',
                            refresh_token: refreshToken,
                            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
                        }
                    );

                    localStorage.setItem('accessToken', data.access_token);
                    api.defaults.headers.Authorization = `Bearer ${data.access_token}`;
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

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
