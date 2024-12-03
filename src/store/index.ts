import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import todoReducer from "@/store/slices/todoSlice";
import meetingReducer from "@/store/slices/meetingSlice";
import agendaReducer from "@/store/slices/agendaSlice";
import clientesReducer from '@/store/slices/clientesSlice';
import apoliceReducer from '@/store/slices/apoliceSlice';
import profileReducer from '@/store/slices/profileSlice';
import logoutMiddleware from '@/middleware/logoutMiddleware';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Usa o localStorage

// Configuração de persistência
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['leads', 'auth'], // Reducers que serão persistidos
};

// Combinar reducers
const rootReducer = combineReducers({
    auth: authReducer,
    clientes: clientesReducer,
    leads: leadsReducer,
    meetings: meetingReducer,
    agenda: agendaReducer,
    tasks: todoReducer,
    apolices: apoliceReducer,
    profile: profileReducer,
});

// Aplicar o persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuração da store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Necessário para redux-persist funcionar
        }).concat(logoutMiddleware),
});

// Criar o persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
