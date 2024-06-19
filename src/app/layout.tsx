// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./(styles)/globals.css";
import ReduxProvider from './ReduxProvider';
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Coretto - CRM",
    description: "CRM inteligente feito para corretores",
    icons: {
        icon: '/icon.png',
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body id={'__next'} className={inter.className}>
        <ReduxProvider>
            {children}
        </ReduxProvider>
        </body>
        </html>
    );
}
