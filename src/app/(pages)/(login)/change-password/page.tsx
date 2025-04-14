'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/axios';
import {
    PageWrapper,
    FormCard,
    Title,
    StyledForm,
    StyledInput,
    StyledButton,
    Message
} from './ChangePassword.styled';

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setMessage('Você precisa estar logado para alterar a senha.');
            return;
        }

        try {
            await api.post('/change_password/', {
                old_password: currentPassword,
                new_password: newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setMessage('✅ Senha alterada com sucesso!');
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error) {
            setMessage('🚨 Erro ao alterar senha. Verifique suas credenciais.');
            console.error('Erro ao alterar senha:', error);
        }
    };

    return (
        <PageWrapper>
            <FormCard>
                <Title>Alterar Senha</Title>
                <StyledForm onSubmit={handleSubmit}>
                    <StyledInput
                        type="password"
                        placeholder="Senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <StyledInput
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <StyledButton type="submit">Alterar Senha</StyledButton>
                    {message && <Message>{message}</Message>}
                </StyledForm>
            </FormCard>
        </PageWrapper>
    );
}
