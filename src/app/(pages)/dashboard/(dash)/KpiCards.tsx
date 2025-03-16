import React from "react";
import { CardContainer, Card, IconWrapper } from "./Dashboard.styles";
import { FaUser, FaUsers, FaMoneyBillWave, FaChartLine } from "react-icons/fa";

interface StatsProps {
    stats: {
        clientes: {
            total: number;
            leads: number;
            ativos: number;
            taxa_conversao: number;
            indice_retencao: number;
        };
        apolices: {
            total: number;
            valor_total: number;
            valor_mensalizado: number;
            revisoes_este_mes: number;
            por_tipo: Record<string, number>;
        };
    };
}

const KpiCards: React.FC<StatsProps> = ({ stats }) => {
    return (
        <CardContainer>
            <Card>
                <IconWrapper><FaUsers size={30} /></IconWrapper>
                <h3>Total de Clientes</h3>
                <p>{stats.clientes.total}</p>
            </Card>

            <Card>
                <IconWrapper><FaChartLine size={30} /></IconWrapper>
                <h3>Taxa de Conversão</h3>
                <p>{stats.clientes.taxa_conversao.toFixed(2)}%</p>
            </Card>

            <Card>
                <IconWrapper><FaUser size={30} /></IconWrapper>
                <h3>Índice de Retenção</h3>
                <p>{stats.clientes.indice_retencao.toFixed(2)}%</p>
            </Card>

            <Card>
                <IconWrapper><FaMoneyBillWave size={30} /></IconWrapper>
                <h3>Receita Mensalizada</h3>
                <p>R$ {stats.apolices.valor_mensalizado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </Card>
        </CardContainer>
    );
};

export default KpiCards;
