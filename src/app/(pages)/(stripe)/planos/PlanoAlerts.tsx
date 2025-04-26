'use client';
import React, { useEffect } from 'react';
import { notification, Button } from 'antd';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/app/api/axios';
import {usePathname, useRouter} from 'next/navigation';

interface PlanoAlertsProps {
    profile: any;
    planoFuturo: any;
}

const PlanoAlerts: React.FC<PlanoAlertsProps> = ({ profile, planoFuturo }) => {
    const router = useRouter();
    const pathname = usePathname();

    const diasRestantesTexto = profile?.current_period_end
        ? formatDistanceToNowStrict(parseISO(profile.current_period_end), {
            unit: 'day',
            locale: ptBR,
            addSuffix: false,
        })
        : null;

    const cancelarDowngrade = async () => {
        try {
            await api.post('/pagamentos/cancelar-downgrade/');
            notification.success({
                message: 'Downgrade cancelado com sucesso!',
                placement: 'topRight',
            });
            router.refresh();
        } catch (err) {
            console.error(err);
            notification.error({
                message: 'Erro ao cancelar downgrade. Tente novamente.',
                placement: 'topRight',
            });
        }
    };

    const cancelarPlanoAtual = async () => {
        try {
            await api.post('/pagamentos/cancelar-assinatura/', {
                subscription_id: profile?.assinatura_id,
            });
            notification.success({
                message: `Plano cancelado! Você ainda terá acesso por ${diasRestantesTexto}.`,
                placement: 'topRight',
            });
            router.refresh();
        } catch (err) {
            console.error(err);
            notification.error({
                message: 'Erro ao cancelar plano.',
                placement: 'topRight',
            });
        }
    };

    const handleReativarPlano = async () => {
        try {
            await api.post('/pagamentos/reativar-assinatura/');
            notification.success({
                message: 'Plano reativado com sucesso!',
                placement: 'topRight',
            });
            router.refresh();
        } catch (err) {
            console.error(err);
            notification.error({
                message: 'Erro ao reativar plano.',
                placement: 'topRight',
            });
        }
    };

    useEffect(() => {
        if (!profile) return;
        console.log('[PlansPage] useEffect executou!');

        const isTrialingSemPlano = profile.assinatura_status === 'trialing' && !profile.plano;

        if (profile.cancel_at_period_end && profile.current_period_end) {
            notification.warning({
                message: '⚠️ Atenção!',
                description: (
                    <>
                        {profile.plano_agendado_id && planoFuturo
                            ? `Seu plano será alterado para "${planoFuturo.nome}" em ${diasRestantesTexto}.`
                            : `Seu plano será cancelado em ${diasRestantesTexto}.`}
                        <div style={{ marginTop: 10 }}>
                            <Button
                                size="small"
                                type="primary"
                                danger
                                onClick={cancelarDowngrade}
                            >
                                {profile.plano_agendado_id ? 'Cancelar Downgrade' : 'Cancelar Cancelamento'}
                            </Button>
                        </div>
                    </>
                ),
                placement: 'topRight',
                duration: 10,
            });
        } else if (isTrialingSemPlano && profile.current_period_end) {
            notification.info({
                message: '🚀 Aproveite seu período gratuito!',
                description: (
                    <>
                        {`Seu acesso gratuito termina em ${diasRestantesTexto}.`}
                        {/* Só mostra botão se não estiver já na página de planos */}
                        {pathname !== '/planos' && (
                            <div style={{ marginTop: 10 }}>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => router.push('/planos')}
                                >
                                    Escolher Plano
                                </Button>
                            </div>
                        )}
                    </>
                ),
                placement: 'topRight',
                duration: 10,
            });
        } else if (profile.assinatura_status === 'inactive' && profile.current_period_end) {
            notification.info({
                message: 'ℹ️ Plano Cancelado',
                description: (
                    <>
                        {`Seu plano foi cancelado. Você ainda tem acesso por ${diasRestantesTexto}.`}
                        <div style={{ marginTop: 10 }}>
                            <Button size="small" type="primary" onClick={handleReativarPlano}>
                                Reativar Plano
                            </Button>
                        </div>
                    </>
                ),
                placement: 'topRight',
                duration: 10,
            });
        } else if ((profile.assinatura_status === 'active' || (profile.assinatura_status === 'trialing' && profile.plano)) && !profile.cancel_at_period_end) {
            notification.success({
                message: '✅ Assinatura Ativa!',
                description: (
                    <>
                        {'Sua assinatura está ativa. Se desejar, você pode agendar o cancelamento para o final do período.'}
                        <div style={{ marginTop: 10 }}>
                            <Button size="small" type="primary" danger onClick={cancelarPlanoAtual}>
                                Agendar Cancelamento
                            </Button>
                        </div>
                    </>
                ),
                placement: 'topRight',
                duration: 10,
            });
        }
    }, [profile, planoFuturo]);

    return null;
};

export default PlanoAlerts;
