// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: 'Politicas de privacidade - Corretor Lab',
    description: 'Politicas de privacidade no Corretor Lab',
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

