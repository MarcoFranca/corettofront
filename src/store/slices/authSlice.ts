import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: {
        access: string;
        refresh: string;
    } | null;
}

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
            const refreshToken = localStorage.getItem('refreshToken');
            if (user && accessToken && refreshToken) {
                state.user = JSON.parse(user);
                state.token = { access: accessToken, refresh: refreshToken };
            }
        },
    },
});

export const { setUser, setToken, logout, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
