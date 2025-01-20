'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/store';
import Spinner from "@/app/components/common/spinner/sppiner";
import SplashScreen from "@/app/components/common/SplashScreen/SplashScreen";

interface ReduxProviderProps {
    children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
    const [isBootstrapped, setIsBootstrapped] = useState(false);

    useEffect(() => {
        const unsubscribe = persistor.subscribe(() => {
            if (persistor.getState().bootstrapped) {
                setIsBootstrapped(true);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (isBootstrapped) {
        return <SplashScreen />;
    }

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};

export default ReduxProvider;
