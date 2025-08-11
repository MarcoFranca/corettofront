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
import TokenAutoRefreshProvider from "@/app/TokenAutoRefreshProvider";
import Script from "next/script";

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

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en">
        <head>
            <title>Corretor Lab - CRM</title>

            {/* Google tag (gtag.js) - Google Ads */}
            {googleAdsId && (
                <>
                    <Script
                        id="gtag-src"
                        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="gtag-init"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${googleAdsId}');
                    `,
                        }}
                    />
                </>
            )}

            {/* Consent Mode padrão */}
            <Script
                id="gtag-consent-default"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                if (!window.gtag) {
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                }
                gtag('consent', 'default', {
                    'ad_storage': 'denied',
                    'analytics_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'region': ['BR']
                });
            `,
                }}
            />
        </head>
        <body id={'__next'} className={inter.className}>
        <ReduxProvider>
            <TokenAutoRefreshProvider/>
            <GoogleProvider>
                <ThemeProviderWrapper>
                    <SoundPlayer/>
                    {children}
                    <RouterInterceptor/>
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
