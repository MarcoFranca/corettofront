"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";

import {ApoliceConsorcio} from "@/types/ApolicesInterface";
import {useRouter} from "next/navigation";
import {ActionButtons} from "@/app/(pages)/dashboard/(painel_admin)/apolices/[id]/ApoliceDetalhes.styles";
import {FaArrowLeft} from "react-icons/fa";
import KpiCardsConsorcio from "@/app/(pages)/dashboard/(painel_admin)/apolices/consorcio/(KpiCards)/KpiCards";
import ConsorcioTable from "@/app/(pages)/dashboard/(painel_admin)/apolices/consorcio/(KpiCards)/ConsorcioTable";
import ConsorcioCharts from "@/app/(pages)/dashboard/(painel_admin)/apolices/consorcio/(KpiCards)/ConsorcioCharts";
import {
    ConsorcioContainer, TableChart,
    TableChartTable
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/consorcio/ApolicesPage.styles";
import {CardsContainer} from "@/app/(pages)/dashboard/(painel_admin)/perfil/(components)/PERFIL/profiles.styled";

interface Stats {
    total_apolices: number;
    valor_total: number;
    media_valor: number;
    revisoes_este_mes: number;
    por_administradora: Record<string, number>;
}

const PrevidenciaPage: React.FC = () => {
    const [apolices, setApolices] = useState<ApoliceConsorcio[]>([]);
    const [stats, setStats] = useState<Stats>({
        total_apolices: 0,
        valor_total: 0,
        media_valor: 0,
        revisoes_este_mes: 0,
        por_administradora: {},
    });

    const fetchApolices = async () => {
        try {
            const response = await api.get("/apolices/consorcio/", { params: { tipo: "consorcio" } });
            setApolices(response.data);
            console.log(response);
        } catch (error) {
            console.error("Erro ao buscar apólices de consórcio:", error);
        }
    };

    const fetchConsorcioStats = async () => {
        try {
            const response = await api.get("/apolices/consorcio/stats/");
            setStats(response.data);
            console.log(response);
        } catch (error) {
            console.error("Erro ao buscar estatísticas de consórcio:", error);
        }
    };

    useEffect(() => {
        fetchApolices();
        fetchConsorcioStats();
    }, []);

    const router = useRouter();

    return (
        <ConsorcioContainer>
            <CardsContainer>
                <ActionButtons>
                    <h3>🏦 Gestão de Consórcios</h3>
                    <button onClick={() => router.back()} className="back-btn">
                        <FaArrowLeft /> Voltar
                    </button>
                </ActionButtons>
                <KpiCardsConsorcio stats={stats} />
            </CardsContainer>

            <TableChartTable>
                <h3>📋 Dados das Apólices</h3>
                <ConsorcioTable apolices={apolices} setApolices={setApolices} />
            </TableChartTable>

            <TableChart>
                <ConsorcioCharts stats={stats} />
            </TableChart>
        </ConsorcioContainer>
    );
};

export default PrevidenciaPage;
