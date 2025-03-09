'use client';

import React, { useEffect, useState } from 'react';
import api from "@/app/api/axios";
import ApolicesTable from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceTable";
import KpiCards from "./(kpicards)/KpiCards";
import PlanoSaudeCharts from "./(kpicards)/PlanoSaudeCharts";
import {Apolice, ApolicePlanoSaude} from "@/types/interfaces";
import {
    PlanoSaudeContainer,
    Title
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/plano_saude/ApolicesPage.styles";
import PlanoSaudeTable from "@/app/components/apolices/tables/PlanoSaudeTable";

interface Stats {
    total_apolices: number;
    valor_total: number;
    media_valor: number;
    revisoes_este_mes: number;
    por_administradora: Record<string, number>;
}

const PlanoSaudePage: React.FC = () => {
    const [apolices, setApolices] = useState<ApolicePlanoSaude[]>([]);
    const [stats, setStats] = useState<Stats>({
        total_apolices: 0,
        valor_total: 0,
        media_valor: 0,
        revisoes_este_mes: 0,
        por_administradora: {}
    });

    const fetchApolices = async () => {
        try {
            const response = await api.get("/apolices/plano_saude/", { params: { tipo: "plano_saude" } });
            setApolices(response.data);
        } catch (error) {
            console.error("Erro ao buscar apólices de plano de saúde:", error);
        }
    };

    const fetchPlanoSaudeStats = async () => {
        try {
            const response = await api.get("apolices/plano_saude/stats/");
            setStats(response.data);
        } catch (error) {
            console.error("Erro ao buscar estatísticas de planos de saúde:", error);
        }
    };

    useEffect(() => {
        fetchApolices();
        fetchPlanoSaudeStats();
    }, []);

    return (
        <PlanoSaudeContainer>
            <Title>🩺 Gestão de Planos de Saúde</Title>
            <KpiCards stats={stats} />
            <div>
                <PlanoSaudeTable apolices={apolices} setApolices={setApolices} />
            </div>
            <div>
                <PlanoSaudeCharts stats={stats} />

            </div>
        </PlanoSaudeContainer>
    );
};

export default PlanoSaudePage;
