"use client";
import React from "react";
import { Card, CardContainer } from "./Dashboard.styles";

interface StatsProps {
    apolices: {
        total: number;
        valor_total: number;
        valor_mensalizado: number;
        revisoes_este_mes: number;
        capital_segurado_total?: number;
        novas_este_mes?: number;
    };
}

const KpiCardsApolices: React.FC<{ stats: StatsProps }> = ({ stats }) => {
    return (
        <CardContainer>
            <Card>
                <h3>📋 Apólices Ativas</h3>
                <p>{stats.apolices.total}</p>
            </Card>

            <Card>
                <h3>💸 Receita Mensalizada</h3>
                <p>R$ {stats.apolices.valor_mensalizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </Card>

            <Card>
                <h3>📆 Revisões Pendentes</h3>
                <p>{stats.apolices.revisoes_este_mes} revisões neste mês</p>
            </Card>

            <Card>
                <h3>🔐 Capital Segurado Total</h3>
                <p>R$ {stats.apolices.capital_segurado_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
            </Card>

            <Card>
                <h3>🆕 Apólices Novas no Mês</h3>
                <p>{stats.apolices.novas_este_mes || 0}</p>
            </Card>
        </CardContainer>
    );
};

export default KpiCardsApolices;
