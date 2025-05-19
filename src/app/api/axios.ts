import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 🚨 Axios limpo, sem interceptores
const rawAxios = axios.create();

// Interceptador para adicionar token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptador de resposta para renovar tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data } = await rawAxios.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token/`,
                        { refresh_token: refreshToken }
                    );

                    console.log('[🔁 REFRESH TOKEN EXECUTADO]');

                    const newAccessToken = data.access_token;
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('accessTokenExpiresAt', (Date.now() + data.expires_in * 1000).toString());

                    api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (err) {
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
