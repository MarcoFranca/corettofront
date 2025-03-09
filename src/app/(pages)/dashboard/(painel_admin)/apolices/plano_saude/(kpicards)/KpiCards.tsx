'use client';

import React from "react";
import { Card, CardContainer } from "./KpiCards.styles";

interface KpiCardsProps {
    stats: {
        total_apolices: number;
        valor_total: number;
        media_valor: number;
        revisoes_este_mes: number;
    };
}

const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
    return (
        <CardContainer>
            <Card>
                <h3>📄 Total de Apólices</h3>
                <p>{stats.total_apolices}</p>
            </Card>
            <Card>
                <h3>💰 Valor Total</h3>
                <p>R$ {stats.valor_total.toFixed(2)}</p>
            </Card>
            <Card>
                <h3>📈 Valor Médio por Apólice</h3>
                <p>R$ {stats.media_valor.toFixed(2)}</p>
            </Card>
            <Card>
                <h3>🔔 Revisões Este Mês</h3>
                <p>{stats.revisoes_este_mes}</p>
            </Card>
        </CardContainer>
    );
};

export default KpiCards;
