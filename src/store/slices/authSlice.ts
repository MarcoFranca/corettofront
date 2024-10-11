import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/types/interfaces';
import api from '@/app/api/axios';
import qs from 'qs'; // Para serializar os dados no formato correto


const initialState: AuthState = {
    user: null,
    token: null,
};

// Adicione as credenciais do cliente aqui (você pode configurá-las em variáveis de ambiente para maior segurança)
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || 'hn9sCCN9ceHIuXjYshPYrct3Xw3hDwP5kpXsDAOa';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET || 'HEmcyueQ5aP2AdabL1fhBdyIlrVQanoWl2ZKhawrf4dAUndZBINPAFVI6asBnw9Zp8qJCKb44BH87smCYJ3ZrBmPl2VMPmNcdfWvvjDjGSHcqr3zHJe5SGdptsNXFzky';

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
        setToken: (state, action: PayloadAction<{ access: string; refresh?: string } | null>) => {
            state.token = action.payload
                ? {
                    access: action.payload.access,
                    refresh: action.payload.refresh || '', // Se refresh não for fornecido, define como string vazia
                }
                : null;

            if (action.payload) {
                localStorage.setItem('accessToken', action.payload.access);
                if (action.payload.refresh) {
                    localStorage.setItem('refreshToken', action.payload.refresh);
                } else {
                    localStorage.removeItem('refreshToken');
                }
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        },

        // Função para carregar o token do LocalStorage ao iniciar
        setTokenFromLocalStorage: (state) => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (accessToken) {
                state.token = {
                    access: accessToken,
                    refresh: refreshToken || '', // Se não houver refresh token, será uma string vazia
                };
            }
        },

        logout: (state) => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            console.log(`accessToken:${accessToken} refreshToken:${refreshToken}`);

            // Remova imediatamente os dados do localStorage e do estado
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('profileImage');

            // Depois, faça a requisição para revogar o token
            if (refreshToken) {
                const requestBody = qs.stringify({
                    token: refreshToken,
                    token_type_hint: 'refresh_token',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                });

                api.post('/o/revoke_token/', requestBody, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then(() => {
                    console.log('Token revogado com sucesso');
                }).catch((error) => {
                    console.error('Erro ao revogar o token:', error);
                });
            }
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
