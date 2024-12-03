import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import todoReducer from '@/store/slices/todoSlice';
import meetingReducer from '@/store/slices/meetingSlice';
import agendaReducer from '@/store/slices/agendaSlice';
import clientesReducer from '@/store/slices/clientesSlice';
import apoliceReducer from '@/store/slices/apoliceSlice';
import profileReducer from '@/store/slices/profileSlice';

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

// Persistência aplicada ao reducer combinado
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Necessário para redux-persist
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
