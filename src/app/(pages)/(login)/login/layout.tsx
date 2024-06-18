// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: 'Login - Coretto CRM',
    description: 'Faça login no Coretto CRM',
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

