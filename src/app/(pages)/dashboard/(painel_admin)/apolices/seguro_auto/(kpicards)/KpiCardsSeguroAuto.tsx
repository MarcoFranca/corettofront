import React from "react";
import { CardContainer, KpiCard } from "../../plano_saude/(kpicards)/KpiCards.styles";
import { FaCar, FaMoneyBillWave, FaBell, FaChartLine } from "react-icons/fa";

interface Stats {
    total_apolices: number;
    valor_total: number;
    media_valor: number;
    revisoes_este_mes: number;
}

interface KpiCardsSeguroAutoProps {
    stats: Stats;
}

const KpiCardsSeguroAuto: React.FC<KpiCardsSeguroAutoProps> = ({ stats }) => (
    <CardContainer>
        <KpiCard>
            <div className="icon"><FaCar /></div>
            <div className="content">
                <h3>Total de Apólices</h3>
                <p>{stats.total_apolices}</p>
            </div>
        </KpiCard>
        <KpiCard>
            <div className="icon"><FaMoneyBillWave /></div>
            <div className="content">
                <h3>Valor Total</h3>
                <p>R$ {stats.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </div>
        </KpiCard>
        <KpiCard>
            <div className="icon"><FaChartLine /></div>
            <div className="content">
                <h3>Valor Médio</h3>
                <p>R$ {stats.media_valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </div>
        </KpiCard>
        <KpiCard className="clickable">
            <div className="icon"><FaBell /></div>
            <div className="content">
                <h3>Revisões Este Mês</h3>
                <p>{stats.revisoes_este_mes}</p>
            </div>
        </KpiCard>
    </CardContainer>
);

export default KpiCardsSeguroAuto;
