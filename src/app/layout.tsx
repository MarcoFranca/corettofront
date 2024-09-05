// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./(styles)/globals.css";
import ReduxProvider from './ReduxProvider';
import React from "react";
// _app.tsx ou layout.tsx (se usando App Router)
import '../styles/antd-styles.css';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Corretor Lab - CRM",
    description: "CRM inteligente feito para corretores",
    icons: {
        icon: '/icon.svg',
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
