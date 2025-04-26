'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, message } from 'antd';
import { formatDistanceToNowStrict, parseISO, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from "@/app/api/axios";

interface OnboardingBannerProps {
    emailConfirmado: boolean;
    planoAtivo: boolean;
    planoSelecionado: boolean;
    currentPeriodEnd: string | null;
    email: string;
    assinaturaStatus: string;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
                                                               emailConfirmado,
                                                               planoAtivo,
                                                               planoSelecionado,
                                                               currentPeriodEnd,
                                                               email,
                                                               assinaturaStatus,
                                                           }) => {
    const router = useRouter();

    // 📧 Prioridade 1: Email não confirmado
    if (!emailConfirmado) {
        return (
            <Alert
                message="📧 Confirmação de E-mail Pendente"
                description={
                    <>
                        Confirme seu e-mail para liberar todas as funcionalidades do CRM.<br />
                        <strong>E-mail cadastrado:</strong> {email}<br />
                        Se o e-mail estiver errado,&nbsp;
                        <Button type="link" size="small" onClick={() => router.push('/dashboard/perfil')}>
                            clique aqui para corrigir
                        </Button>.
                    </>
                }
                type="warning"
                showIcon
                action={
                    <Button
                        size="small"
                        type="primary"
                        onClick={async () => {
                            try {
                                await api.post('/reenviar-confirmacao/', { email });
                                message.success(`E-mail de confirmação enviado para ${email}`);
                            } catch (error) {
                                console.error(error);
                                message.error('Erro ao reenviar e-mail de confirmação.');
                            }
                        }}
                    >
                        Reenviar E-mail
                    </Button>
                }
                style={{ marginBottom: 16 }}
            />
        );
    }

    // 🚀 Prioridade 2: Nenhum plano vinculado
    if (!planoSelecionado) {
        return (
            <Alert
                message="🚀 Escolha seu Plano"
                description="Você ainda não escolheu um plano. Selecione agora para aproveitar todas as funcionalidades!"
                type="info"
                showIcon
                action={
                    <Button size="small" type="primary" onClick={() => router.push('/planos')}>
                        Escolher Plano
                    </Button>
                }
                style={{ marginBottom: 16 }}
            />
        );
    }

    // ⏳ Prioridade 3: Trial terminando (mas apenas se for status trialing)
    if (assinaturaStatus === 'trialing' && currentPeriodEnd) {
        const diasRestantes = formatDistanceToNowStrict(parseISO(currentPeriodEnd), {
            unit: 'day',
            locale: ptBR,
            addSuffix: false,
        });

        const prazoAcabando = isBefore(new Date(), parseISO(currentPeriodEnd));

        if (prazoAcabando) {
            return (
                <Alert
                    message="⏳ Seu período gratuito está terminando"
                    description={`Seu acesso termina em ${diasRestantes}. Não deixe para a última hora!`}
                    type="warning"
                    showIcon
                    action={
                        <Button size="small" type="primary" onClick={() => router.push('/planos')}>
                            Ativar Plano
                        </Button>
                    }
                    style={{ marginBottom: 16 }}
                />
            );
        }
    }

    // 🎯 Nenhum alerta se tudo OK
    return null;
};

export default OnboardingBanner;
