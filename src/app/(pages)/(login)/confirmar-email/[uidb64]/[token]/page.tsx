'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import api from '@/app/api/axios';
import { toastError, toastSuccess } from "@/utils/toastWithSound";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 2rem;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 2rem;
    color: #042a75;
    margin-bottom: 1rem;
`;

const Message = styled.p`
    font-size: 1.1rem;
    color: #333;
`;

const Spinner = styled.div`
    margin-top: 2rem;
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top-color: #33cccc;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export default function ConfirmEmailPage({ params }: { params: { uidb64: string; token: string } }) {
    const { uidb64, token } = params;
    const [status, setStatus] = useState<'success' | 'error' | 'none'>('none');
    const router = useRouter();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await api.post(`/confirmar-email/${uidb64}/${token}/`);
                toastSuccess('🎉 E-mail confirmado com sucesso!');
                setStatus('success');

                const assinaturaStatus = response.data.assinatura_status;
                const accessToken = localStorage.getItem('accessToken');
                const price_id = process.env.NEXT_PUBLIC_PRICE_ID || '';
                const plano_id = process.env.NEXT_PUBLIC_PLANO_ID || '';

                if (assinaturaStatus === 'active' || assinaturaStatus === 'trialing') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    router.push('/dashboard'); // ou onde quiser levar quem já tem plano
                    return;
                }

                if (!accessToken) {
                    toastError('❌ Token de acesso não encontrado. Faça login novamente.');
                    router.push('/login');
                    return;
                }

                const checkout = await api.post(
                    '/pagamentos/create-checkout-session/',
                    { price_id, plano_id },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (checkout.data?.checkout_url) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    router.push(checkout.data.checkout_url);
                } else {
                    toastError('🚨 Erro ao redirecionar para o checkout.');
                    router.push('/erro-checkout');
                }

            } catch {
                setStatus('error');
                toastError('❌ Link inválido ou expirado.');
                router.push('/reenviar-confirmacao');
            }
        };

        confirmEmail();
    }, [uidb64, token, router]);

    return (
        <Container>
            <Title>Confirmação de E-mail</Title>
            {status === 'none' && <Spinner />}
            {status === 'success' && <Message>Seu e-mail foi confirmado com sucesso! Redirecionando...</Message>}
            {status === 'error' && <Message>O link de confirmação é inválido ou expirou. Solicite um novo.</Message>}
        </Container>
    );
}
