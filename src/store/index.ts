import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import todoReducer from "@/store/slices/todoSlice";
import agendaReducer from "@/store/slices/agendaSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        leads: leadsReducer,
        tasks:todoReducer,
        agenda: agendaReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
