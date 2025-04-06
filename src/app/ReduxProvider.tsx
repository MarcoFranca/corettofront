'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import dynamic from 'next/dynamic';
import type { Persistor } from 'redux-persist';
import Loading from "@/app/loading";

// Lazy load do PersistGate, pois só pode rodar no client
const PersistGate = dynamic(
    () => import('redux-persist/integration/react').then(mod => mod.PersistGate),
    { ssr: false }
);

// Também carrega o persistor dinamicamente
const getPersistor = () => import('@/store').then(mod => mod.persistor);

interface ReduxProviderProps {
    children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
    const [persistor, setPersistor] = useState<Persistor | null>(null);

    useEffect(() => {
        getPersistor().then((persistorInstance) => {
            setPersistor(persistorInstance); // ✅ Agora está certo
        });
    }, []);

    if (!persistor) {
        return <Loading />;
    }

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={<Loading />}>
                {children}
            </PersistGate>
        </Provider>
    );
};

export default ReduxProvider;