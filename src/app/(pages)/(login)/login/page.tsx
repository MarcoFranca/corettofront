// LoginPage.tsx
"use client";

import LoginForm from "@/app/(pages)/(login)/login/LoginForm";
import { PageWrapper } from "./Login.styled";

export default function LoginPage() {
    return (
        <PageWrapper>
            <LoginForm />
        </PageWrapper>
    );

    // Estilo premium aplicado no styled-component "PageWrapper" no arquivo Login.styled.ts
}
