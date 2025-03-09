'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import { DashboardContainer } from "@/app/(pages)/dashboard/(dash)/Dashboard.styles";
import KpiCards from "@/app/(pages)/dashboard/(dash)/KpiCards";
import Charts from "@/app/(pages)/dashboard/(dash)/Charts";
import Loading from "@/app/loading";

const DashboardPage = () => {
    const [stats, setStats] = useState({
        clientes: { total: 0, leads: 0, ativos: 0, taxa_conversao: 0, indice_retencao: 0 },
        apolices: { total: 0, valor_total: 0, valor_mensalizado: 0, revisoes_este_mes: 0, por_tipo: {} }
    });
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

    if (loading) return <Loading />; // 🔥 Indicador de carregamento

    return (
        <DashboardContainer>
            <h1>📊 Dashboard</h1>
            <KpiCards stats={stats} />
            <Charts stats={stats} />  {/* 🔥 Adicionando gráficos dinâmicos */}
        </DashboardContainer>
    );
};

export default DashboardPage;
