// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: 'Cadastre-se - Coretto CRM',
    description: 'Faça seu cadastro no Coretto CRM',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}

