"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import KpiCards from "./(kpicards)/KpiCards";
import PlanoSaudeCharts from "./(kpicards)/PlanoSaudeCharts";
import PlanoSaudeTable from "@/app/components/apolices/tables/PlanoSaudeTable";
import {
    PlanoSaudeContainer,
    Title, CardsContainer, TableChartTable, TableChart,
} from "./ApolicesPage.styles";
import {ApolicePlanoSaude} from "@/types/ApolicesInterface";
import {useRouter} from "next/navigation";
import {ActionButtons} from "@/app/(pages)/dashboard/(painel_admin)/apolices/[id]/ApoliceDetalhes.styles";
import {FaArrowLeft} from "react-icons/fa";

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
        por_administradora: {},
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

    const router = useRouter();

    return (
        <PlanoSaudeContainer>
            <CardsContainer>
                {/* 🔹 Botões de ação */}
                <ActionButtons>
                <Title>🩺 Gestão de Planos de Saúde</Title>
                    <button onClick={() => router.back()} className="back-btn">
                        <FaArrowLeft /> Voltar
                    </button>
                </ActionButtons>
                <KpiCards stats={stats} />
            </CardsContainer>

            {/* 📌 Wrapper que organiza a tabela e o gráfico lado a lado */}
                <TableChartTable >
                    <Title>📋 Dados das Apólices</Title>
                    <PlanoSaudeTable apolices={apolices} setApolices={setApolices} />
                </TableChartTable>
                <TableChart >
                    <PlanoSaudeCharts stats={stats} />
                </TableChart>
        </PlanoSaudeContainer>
    );
};

export default PlanoSaudePage;
