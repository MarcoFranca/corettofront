// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: 'Minha assinatura - Corretor Lab',
    description: 'verifique as sua assinatura Corretor Lab',
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

