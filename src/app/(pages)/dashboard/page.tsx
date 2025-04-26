// Novo componente para a dashboard com styled-components e gráficos
'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import { DashboardContainer, HeaderBar, ButtonLink } from './Dashboard.styles';
import KpiCards from './(dash)/KpiCards';
import Loading from '@/app/loading';
import { Button } from 'antd';

import StrategicChartstegic from "@/app/(pages)/dashboard/(dash)/StrategicChartstegic";
import StrategicCharts from "@/app/(pages)/dashboard/(dash)/StrategicCharts";
import ProgressBars from "@/app/(pages)/dashboard/(dash)/ProgressBars";
import TrialProgress from "@/app/components/openai/TrialProgress";

import { useProfile } from '@/hooks/useProfile';
import { RootState } from "@/store";
import OnboardingBanner from "@/app/(pages)/dashboard/(dash)/OnboardingBanner";
import {Profile} from "@/types/interfaces";

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
};

const DashboardPage = () => {
    const { profile, isLoading, hasError } = useProfile();
    const [stats, setStats] = useState<Stats>({
        clientes: { total: 0, leads: 0, ativos: 0, taxa_conversao: 0, indice_retencao: 0 },
        apolices: { total: 0, valor_total: 0, valor_mensalizado: 0, revisoes_este_mes: 0, por_tipo: {} },
    });

    const [topParceiros, setTopParceiros] =
        useState<{ nome: string; total_indicacoes: number }[]>([]);
    const [receitaMensal, setReceitaMensal] =
        useState<{ mes: string; total: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    console.log("birola", profile)
        async function fetchStats() {
            try {
                const response = await api.get("/dashboard/");
                setStats(response.data);
                setTopParceiros(response.data.parceiros);
                setReceitaMensal(response.data.receita_mensal);
                console.log('parceiros',response.data.parceiros )
                console.log('parceiros',response.data.receita_mensal )
                console.log('parceiros',response.data )
                setStats(response.data);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading || !profile) return <Loading />;


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
                        valorMeta: 50, // 💡 Meta fixa ou vinda de config/backend
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
                topParceiros={topParceiros}
                receitaMensal={receitaMensal}
            />

        </DashboardContainer>
    );
};

export default DashboardPage;