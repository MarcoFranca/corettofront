import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/types/interfaces';

const initialState: AuthState = {
    user: null,
    token: null,
};

// Não incluímos `api` e removemos a lógica de revogação diretamente do slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
                if (action.payload.profileImage) {
                    localStorage.setItem('profileImage', action.payload.profileImage);
                }
            } else {
                localStorage.removeItem('user');
                localStorage.removeItem('profileImage');
            }
        },

        setToken: (state, action: PayloadAction<{ access: string; refresh?: string; expires_in?: number } | null>) => {
            state.token = action.payload
                ? {
                    access: action.payload.access,
                    refresh: action.payload.refresh || '',
                }
                : null;

            if (action.payload) {
                localStorage.setItem('accessToken', action.payload.access);
                if (action.payload.refresh) {
                    localStorage.setItem('refreshToken', action.payload.refresh);
                } else {
                    localStorage.removeItem('refreshToken');
                }

                // 💡 Aqui salva o timestamp de expiração em milissegundos
                if (action.payload.expires_in) {
                    const expiresAt = Date.now() + action.payload.expires_in * 1000;
                    localStorage.setItem('accessTokenExpiresAt', expiresAt.toString());
                }
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessTokenExpiresAt');
            }
        },

        setTokenFromLocalStorage: (state) => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (accessToken) {
                state.token = {
                    access: accessToken,
                    refresh: refreshToken || '',
                };
            }
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('profileImage');
        },

        setUserFromLocalStorage: (state) => {
            const user = localStorage.getItem('user');
            if (user) {
                state.user = JSON.parse(user);
            }
        },

        updateAccessToken: (state, action: PayloadAction<string>) => {
            if (state.token) {
                state.token.access = action.payload;
                localStorage.setItem('accessToken', action.payload);
            }
        },
    },
});

export const { setUser, setToken, setTokenFromLocalStorage, logout, setUserFromLocalStorage, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
