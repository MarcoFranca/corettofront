import axios from 'axios';
import { Cliente } from "@/types/interfaces";

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// Instância principal do axios
const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Interceptador de requisições
instance.interceptors.request.use(
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

// Interceptador de respostas
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se o token expirou e a resposta foi 401 (Unauthorized)
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // Instância separada para requisição ao endpoint de OAuth2 sem a baseURL
                    const oauthApi = axios.create();

                    // Requisição para o endpoint de refresh do OAuth2
                    const { data } = await oauthApi.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token/`, {
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,  // Adicionar o client_id
                        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,  // Adicionar o client_secret
                    });

                    // Atualiza o token de acesso no localStorage e nos headers
                    localStorage.setItem('accessToken', data.access_token);
                    instance.defaults.headers.Authorization = `Bearer ${data.access_token}`;
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

                    // Reenvia a requisição original com o novo token de acesso
                    return instance(originalRequest);
                } catch (err) {
                    logout();
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

class axiosInstance {
    static async get(url: string) {
        try {
            const response = await instance.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async post(url: string, data: Cliente, config?: { headers: { Authorization: string } }) {
        try {
            const response = await instance.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default axiosInstance;
