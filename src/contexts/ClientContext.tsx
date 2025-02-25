// src/app/contexts/ClientContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useParams } from "next/navigation";

interface ClientContextType {
    clientId: string | null;
}

const ClientContext = createContext<ClientContextType>({ clientId: null });

export const useClient = () => useContext(ClientContext);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { clientId } = useParams(); // Pega o clientId da URL automaticamente
    return (
        <ClientContext.Provider value={{ clientId: clientId?.toString() || null }}>
            {children}
        </ClientContext.Provider>
    );
};
