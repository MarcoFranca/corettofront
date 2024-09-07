import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/types/interfaces';

const initialState: AuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        },
        setToken: (state, action: PayloadAction<{ access: string; refresh: string } | null>) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem('accessToken', action.payload.access);
                localStorage.setItem('refreshToken', action.payload.refresh);
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        setUserFromLocalStorage: (state) => {
            const user = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken'); // Isso pode estar ausente


            // Atualize o estado do Redux mesmo se o refreshToken estiver ausente
            if (user && accessToken) {
                state.user = JSON.parse(user);
                state.token = {
                    access: accessToken,
                    refresh: refreshToken || '', // Se o refreshToken estiver ausente, pode ser uma string vazia
                };
            } else {
                console.log("Usuário ou accessToken ausente no LocalStorage.");
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

export const { setUser, setToken, logout, setUserFromLocalStorage, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
