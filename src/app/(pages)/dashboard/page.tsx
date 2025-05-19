// Novo componente para a dashboard com styled-components e gráficos
'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import {ButtonLink, DashboardContainer, HeaderBar} from './Dashboard.styles';
import KpiCards from './(dash)/KpiCards';
import Loading from '@/app/loading';

import StrategicChartstegic from "@/app/(pages)/dashboard/(dash)/StrategicChartstegic";
import StrategicCharts from "@/app/(pages)/dashboard/(dash)/StrategicCharts";
import ProgressBars from "@/app/(pages)/dashboard/(dash)/ProgressBars";

import { useProfile } from '@/hooks/useProfile';
import {Button} from "antd";
import TrialProgress from "@/app/components/openai/TrialProgress";
import OnboardingBanner from "@/app/(pages)/dashboard/(dash)/OnboardingBanner";


type Stats = {
    clientes: {
        total: number;
        leads: number;
        ativos: number;
        taxa_conversao: number;
        indice_retencao: number;
        novos_este_mes?: number;
    };
    apolices: {
        total: number;
        valor_total: number;
        valor_mensalizado: number;
        revisoes_este_mes: number;
        novas_este_mes?: number;
        por_tipo: Record<string, number>;
    };
    estrategico?: {
        funil_pipeline: { pipeline_stage: string; total: number }[];
        produtos_vendidos: { tipo_nome: string; value: number }[];
    };
    parceiros?: { nome: string; total_indicacoes: number }[];
    receita_mensal?: { mes: string; total: number }[];
};


const DashboardPage = () => {
    const { profile, isLoading, hasError } = useProfile();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await api.get("/dashboard/");
                setStats(response.data);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading || !profile || !stats) return <Loading />;

    return (
        <DashboardContainer>
            <HeaderBar>
                <h1>📊 Dashboard</h1>
                <ButtonLink href="/dashboard/relatorio-negociacoes">
                    <Button type="primary">📈 Ver Relatório Estratégico Completo</Button>
                </ButtonLink>
                <TrialProgress/>
            </HeaderBar>
            {profile ? (
                <OnboardingBanner
                    emailConfirmado={profile.email_confirmado ?? false}
                    planoAtivo={profile.assinatura_status === 'active' || profile.assinatura_status === 'trialing'}
                    planoSelecionado={!!profile.plano}
                    currentPeriodEnd={profile.current_period_end ?? null}
                    email={profile.user.email} // 🔥 novo
                    assinaturaStatus={profile.assinatura_status}
                />

            ) : (
                <></>
            )}

            <KpiCards stats={stats} />
            <ProgressBars
                metas={[
                    {
                        titulo: 'Novos Leads no Mês',
                        valorAtual: stats.clientes.novos_este_mes || 0,
                        valorMeta: 50,
                    },
                    {
                        titulo: 'Apólices Emitidas',
                        valorAtual: stats.apolices.novas_este_mes || 0,
                        valorMeta: 30,
                    },
                    {
                        titulo: 'Receita Mensal Alvo',
                        valorAtual: Number(stats.apolices.valor_mensalizado) || 0,
                        valorMeta: 40000,
                    },
                ]}
            />
            <StrategicChartstegic
                funilPipeline={stats.estrategico?.funil_pipeline || []}
                produtosVendidos={stats.estrategico?.produtos_vendidos.map(p => ({
                    name: p.tipo_nome || 'Outro',
                    value: p.value,
                })) || []}
            />
            <StrategicCharts
                topParceiros={stats.parceiros || []}
                receitaMensal={stats.receita_mensal || []}
            />
        </DashboardContainer>
    );
};


export default DashboardPage;