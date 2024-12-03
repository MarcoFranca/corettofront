'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/store';

interface ReduxProviderProps {
    children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => (
    <Provider store={store}>
        <PersistGate loading={<p>Carregando estado persistido...</p>} persistor={persistor}>
            {children}
        </PersistGate>
    </Provider>
);

export default ReduxProvider;
