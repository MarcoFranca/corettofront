'use client';

import { useState } from "react";
import api from "@/app/api/axios";
import {
    FormWrapper,
    StyledForm,
    StyledImage,
    StyledTitle,
    StyledParagraph,
    StyledInput,
    StyledButton,
    Message,
    StyledLink,
    BackToLogin, Spinner
} from "./ResetPassword.styled";

import CadeadoImage from "../../../../../public/assets/common/cadeado.png";


export default function ResetPasswordForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // <--- Adiciona aqui
        try {
            await api.post('/password_reset/', { email });
            setMessage('📩 Se um usuário com esse e-mail existir, um link de redefinição de senha será enviado.');
        } catch (error) {
            setMessage('🚨 Erro ao solicitar redefinição de senha. Tente novamente.');
            console.error('Erro ao solicitar redefinição de senha:', error);
        } finally {
            setLoading(false); // <--- Finaliza aqui
        }
    };


    return (
        <FormWrapper>
            <StyledForm onSubmit={handleSubmit}>
                <StyledImage src={CadeadoImage} alt="Cadeado" priority />
                <StyledTitle>Problemas para entrar?</StyledTitle>
                <StyledParagraph>
                    Insira o seu e-mail e enviaremos um link para você voltar a acessar sua conta.
                </StyledParagraph>
                <StyledInput
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <StyledButton type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            Enviando... <Spinner />
                        </>
                    ) : (
                        'Enviar link de acesso'
                    )}
                </StyledButton>
                <StyledParagraph style={{ marginBottom: "0.5rem" }}>ou</StyledParagraph>
                <StyledLink href="/register">Criar nova conta</StyledLink>
                {message && <Message>{message}</Message>}
            <BackToLogin href="/login">← Voltar ao Login</BackToLogin>
            </StyledForm>
        </FormWrapper>
    );
}
