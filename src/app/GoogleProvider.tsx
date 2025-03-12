'use client';

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

type GoogleProviderProps = {
    children: ReactNode
}

export default function GoogleProvider({ children }: GoogleProviderProps) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {children}
        </GoogleOAuthProvider>
    );
}
