"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import SeguroVidaTable from "./(KpiCards)/SeguroVidaTable";
import {
    SeguroVidaContainer,
    Title, CardsContainer, TableChartTable, TableChart
} from "./ApolicesPage.styles";
import { ApoliceSeguroVida } from "@/types/ApolicesInterface";
import { useRouter } from "next/navigation";
import { ActionButtons } from "@/app/(pages)/dashboard/(painel_admin)/apolices/[id]/ApoliceDetalhes.styles";
import { FaArrowLeft } from "react-icons/fa";
import SeguroVidaCharts from "@/app/(pages)/dashboard/(painel_admin)/apolices/seguro_vida/(KpiCards)/SeguroVidaCharts";
import KpiCardsPlanoSaude
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/plano_saude/(kpicards)/KpiCardsPlanoSaude";

interface Stats {
    total_apolices: number;
    valor_total: number;
    media_valor: number;
    revisoes_este_mes: number;
    por_administradora: Record<string, number>;
}

const SeguroVidaPage: React.FC = () => {
    const [apolices, setApolices] = useState<ApoliceSeguroVida[]>([]);
    const [stats, setStats] = useState<Stats>({
        total_apolices: 0,
        valor_total: 0,
        media_valor: 0,
        revisoes_este_mes: 0,
        por_administradora: {},
    });

    const fetchApolices = async () => {
        try {
            const response = await api.get("/apolices/seguro_vida/", { params: { tipo: "seguro_vida" } });
            setApolices(response.data);
            console.log("Bilola",response.data)
        } catch (error) {
            console.error("Erro ao buscar apólices de seguro de vida:", error);
        }
    };

    const fetchSeguroVidaStats = async () => {
        try {
            const response = await api.get("/apolices/seguro_vida/stats/");
            setStats(response.data);
        } catch (error) {
            console.error("Erro ao buscar estatísticas de seguros de vida:", error);
        }
    };

    useEffect(() => {
        fetchApolices();
        fetchSeguroVidaStats();
    }, []);

    const router = useRouter();

    return (
        <SeguroVidaContainer>
            <CardsContainer>
                {/* 🔹 Botões de ação */}
                <ActionButtons>
                    <Title>🛡️ Gestão de Seguros de Vida</Title>
                    <button onClick={() => router.back()} className="back-btn">
                        <FaArrowLeft /> Voltar
                    </button>
                </ActionButtons>
                <KpiCardsPlanoSaude stats={stats} />
            </CardsContainer>

            <TableChartTable>
                <Title>📋 Dados das Apólices</Title>
                <SeguroVidaTable apolices={apolices} setApolices={setApolices} />
            </TableChartTable>
            <TableChart>
                <SeguroVidaCharts stats={stats} />
            </TableChart>
        </SeguroVidaContainer>
    );
};

export default SeguroVidaPage;
