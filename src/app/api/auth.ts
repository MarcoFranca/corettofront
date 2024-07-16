import axios from 'axios';
import {Lead} from "@/types/interfaces";

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const { data } = await instance.post('/token/refresh/', { refresh: refreshToken });
                    localStorage.setItem('accessToken', data.access);
                    instance.defaults.headers.Authorization = `Bearer ${data.access}`;
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
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

    static async post(url: string, data: Lead, config?: { headers: { Authorization: string } }) {
        try {
            const response = await instance.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default axiosInstance;
