// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;

export default store;
