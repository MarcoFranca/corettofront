"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import KpiCardsSeguroAuto from "./(kpicards)/KpiCardsSeguroAuto";
import SeguroAutoCharts from "./(kpicards)/SeguroAutoCharts";
import SeguroAutoTable from "@/app/components/apolices/tables/SeguroAutoTable";
import {
    PlanoSaudeContainer,
    Title, CardsContainer, TableChartTable, TableChart,
} from "./ApolicesPage.styles";
import { ApoliceSeguroAuto } from "@/types/ApolicesInterface";
import { useRouter } from "next/navigation";
import { ActionButtons } from "@/app/(pages)/dashboard/(painel_admin)/apolices/[id]/ApoliceDetalhes.styles";
import { FaArrowLeft } from "react-icons/fa";

interface Stats {
    total_apolices: number;
    valor_total: number;
    media_valor: number;
    revisoes_este_mes: number;
    por_seguradora: Record<string, number>;
}

const SeguroAutoPage: React.FC = () => {
    const [apolices, setApolices] = useState<ApoliceSeguroAuto[]>([]);
    const [stats, setStats] = useState<Stats>({
        total_apolices: 0,
        valor_total: 0,
        media_valor: 0,
        revisoes_este_mes: 0,
        por_seguradora: {},
    });

    const fetchApolices = async () => {
        try {
            const response = await api.get("/apolices/seguro_auto/", { params: { tipo: "seguro_auto" } });
            setApolices(response.data);
        } catch (error) {
            console.error("Erro ao buscar apólices de seguro auto:", error);
        }
    };

    const fetchSeguroAutoStats = async () => {
        try {
            const response = await api.get("/apolices/seguro_auto/stats/");
            setStats(response.data);
        } catch (error) {
            console.error("Erro ao buscar estatísticas de seguro auto:", error);
        }
    };

    useEffect(() => {
        fetchApolices();
        fetchSeguroAutoStats();
    }, []);

    const router = useRouter();

    return (
        <PlanoSaudeContainer>
            <CardsContainer>
                <ActionButtons>
                    <Title>🚗 Gestão de Seguro Auto</Title>
                    <button onClick={() => router.back()} className="back-btn">
                        <FaArrowLeft /> Voltar
                    </button>
                </ActionButtons>
                <KpiCardsSeguroAuto stats={stats} />
            </CardsContainer>
            <TableChartTable>
                <Title>📋 Dados das Apólices</Title>
                <SeguroAutoTable apolices={apolices} setApolices={setApolices} />
            </TableChartTable>
            <TableChart>
                <SeguroAutoCharts stats={stats} />
            </TableChart>
        </PlanoSaudeContainer>
    );
};

export default SeguroAutoPage;
