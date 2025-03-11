"use client";

import React from "react";
import { Stats } from "@/types/interfaces";
import { CardContainer, KpiCard } from "./KpiCards.styles";
import { FaFileAlt, FaMoneyBillWave, FaBell, FaChartLine } from "react-icons/fa";

interface KpiCardsProps {
    stats: Stats;
}

const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
    return (
        <CardContainer>
            {/* 📄 Total de Apólices */}
            <KpiCard>
                <div className="icon"><FaFileAlt /></div>
                <div className="content">
                    <h3>Total de Apólices</h3>
                    <p>{stats.total_apolices}</p>
                </div>
            </KpiCard>

            {/* 💰 Valor Total Mensal */}
            <KpiCard>
                <div className="icon"><FaMoneyBillWave /></div>
                <div className="content">
                    <h3>Valor Total</h3>
                    <p>R$ {stats.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
            </KpiCard>

            {/* 📈 Valor Médio por Apólice */}
            <KpiCard>
                <div className="icon"><FaChartLine /></div>
                <div className="content">
                    <h3>Valor Médio por Apólice</h3>
                    <p>R$ {stats.media_valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
            </KpiCard>

            {/* 🔔 Revisões Pendentes (Clicável) */}
            <KpiCard className="clickable">
                <div className="icon"><FaBell /></div>
                <div className="content">
                    <h3>Revisões Este Mês</h3>
                    <p>{stats.revisoes_este_mes}</p>
                </div>
            </KpiCard>
        </CardContainer>
    );
};

export default KpiCards;
