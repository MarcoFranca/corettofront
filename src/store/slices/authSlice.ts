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
                localStorage.setItem('token', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('token');
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setUserFromLocalStorage: (state) => {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (user && token) {
                state.user = JSON.parse(user);
                state.token = JSON.parse(token);
            }
        },
    },
});

export const { setUser, setToken, logout, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
