import React from "react";
import type { Metadata } from "next";
import ReduxProvider from "@/app/ReduxProvider";

export const metadata: Metadata = {
    title: 'Login - Coretto CRM',
    description: 'Faça login no Coretto CRM',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <ReduxProvider>
            {children}
        </ReduxProvider>
        </body>
        </html>
    );
}
