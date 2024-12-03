import axios from 'axios';

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

// Interceptador de respostas para renovar tokens automaticamente
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
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

                    // Atualiza o token no localStorage
                    localStorage.setItem('accessToken', newAccessToken);
                    api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
