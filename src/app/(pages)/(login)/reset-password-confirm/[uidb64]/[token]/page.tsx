'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/api/axios';
import {
    FormWrapper,
    StyledForm,
    StyledTitle,
    StyledInput,
    StyledButton,
    Spinner,
    Message
} from './ResetPasswordConfirm.styled';

const ResetPasswordConfirmPage = () => {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/password_reset_confirm/${uidb64}/${token}/`, { password: newPassword });
            setMessage('🎉 Senha redefinida com sucesso!');
            router.push('/login');
        } catch (error) {
            setMessage('🚨 Erro ao redefinir senha. Tente novamente.');
            console.error('Erro ao redefinir senha:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormWrapper>
            <StyledForm onSubmit={handleSubmit}>
                <StyledTitle>Redefinir Senha</StyledTitle>
                <StyledInput
                    type="password"
                    placeholder="Nova Senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <StyledButton type="submit" disabled={loading}>
                    {loading ? <>Enviando... <Spinner /></> : 'Redefinir Senha'}
                </StyledButton>
                {message && <Message>{message}</Message>}
            </StyledForm>
        </FormWrapper>
    );
};

export default ResetPasswordConfirmPage;
