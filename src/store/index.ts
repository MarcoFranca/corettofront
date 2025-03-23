// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import meetingReducer from './slices/meetingSlice';
import agendaReducer from './slices/agendaSlice';
import clientesReducer from './slices/clientesSlice';
import apoliceReducer from './slices/apoliceSlice';
import profileReducer from './slices/profileSlice';
import googleIntegrationReducer from './slices/googleIntegrationSlice';
import parceirosReducer from './slices/parceirosSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    clientes: clientesReducer,
    leads: leadsReducer,
    meetings: meetingReducer,
    agenda: agendaReducer,
    apolices: apoliceReducer,
    profile: profileReducer,
    googleIntegration: googleIntegrationReducer,
    parceiros: parceirosReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// ⚠️ Evita criar persistência no SSR
const isClient = typeof window !== 'undefined';

let store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

let persistor: any = null;

if (isClient) {
    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
        key: 'root',
        storage,
        whitelist: ['auth', 'leads'], // ajuste conforme necessário
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }),
    });

    persistor = persistStore(store);
}

export { store as default, persistor };
