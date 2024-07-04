import axios from 'axios';
import { logout } from '@/store/slices/authSlice';
import store from "@/store";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
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
                    const { data } = await api.post('/token/refresh/', { refresh: refreshToken });
                    localStorage.setItem('accessToken', data.access);
                    api.defaults.headers.Authorization = `Bearer ${data.access}`;
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return api(originalRequest);
                } catch (err) {
                    logout();
                    return Promise.reject(err);
                }
            }
        }
        if (error.response?.status === 401) {
            // Redireciona para a página de login se houver erro de autorização e o usuário estiver logado
            store.dispatch(logout());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
