import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import todoReducer from "@/store/slices/todoSlice";
import meetingReducer  from "@/store/slices/meetingSlice";
import agendaReducer from "@/store/slices/agendaSlice";
import clientesReducer from '@/store/slices/clientesSlice';
import logoutMiddleware from '@/middleware/logoutMiddleware';

const store = configureStore({
    reducer: {
        auth: authReducer,
        clientes: clientesReducer,
        leads: leadsReducer,
        meetings: meetingReducer,
        agenda: agendaReducer,
        tasks:todoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logoutMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
