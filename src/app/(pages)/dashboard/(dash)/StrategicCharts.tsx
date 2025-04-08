// StrategicCharts.tsx (atualizado com Linha 3)
'use client';

import React from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { Card } from 'antd';

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

interface StrategicChartsProps {
    topParceiros: { nome: string; total_indicacoes: number }[];
    receitaMensal: { mes: string; total: number }[];
}

const StrategicCharts: React.FC<StrategicChartsProps> = ({ topParceiros, receitaMensal }) => {
    return (
        <ChartGrid>
            {/* 🧑‍🤝‍🧑 Parceiros com mais indicações */}
            <Card title="🥇 Top Parceiros por Indicações">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topParceiros} layout="vertical">
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="nome" />
                        <Tooltip />
                        <Bar dataKey="total_indicacoes" fill="#33cccc" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* 💰 Receita mensal */}
            <Card title="📆 Receita Mensal">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={receitaMensal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                        <Line type="monotone" dataKey="total" stroke="#33cccc" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </ChartGrid>
    );
};

export default StrategicCharts;
