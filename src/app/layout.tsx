import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./(styles)/globals.css";
import ReduxProvider from './ReduxProvider';
import React from "react";
import '../styles/antd-styles.css';
import GoogleProvider from "./GoogleProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProviderWrapper } from "@/contexts/ThemeContext";
import RouterInterceptor from "@/utils/RouterInterceptor";
import SoundPlayer from "@/utils/soundPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Corretor Lab - CRM",
    description: "CRM inteligente feito para corretores",
    icons: {
        icon: '/icon.svg',
    },
};

// Certifique-se de que o clientId existe
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!googleClientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID não está definido no arquivo .env.local.");
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body id={'__next'} className={inter.className}>
        <ReduxProvider>
            <GoogleProvider>
                <ThemeProviderWrapper>
                    <SoundPlayer />
                    {children}
                    <RouterInterceptor />
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </ThemeProviderWrapper>
            </GoogleProvider>
        </ReduxProvider>
        </body>
        </html>
    );
}
