// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: 'Planos - Corretor Lab',
    description: 'Faça login no Corretor Lab',
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

