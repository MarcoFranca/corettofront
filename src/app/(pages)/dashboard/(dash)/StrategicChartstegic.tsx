// StrategicCharts.tsx - gráficos estratégicos do dashboard
'use client';

import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LabelList
} from 'recharts';

const Section = styled.div`
  margin-top: 2rem;
`;

const ChartGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
`;

const ChartCard = styled(Card)`
  flex: 1;
  min-width: 300px;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE'];

// 🔥 Mock temporário até API real


export interface StrategicChartsProps {
    funilPipeline?: { pipeline_stage: string; total: number }[];
    produtosVendidos?: { name: string; value: number }[];
}


const StrategicCharts: React.FC<StrategicChartsProps> =
    ({
         funilPipeline = [],
         produtosVendidos = [],
                                                         }) => {
    return (
        <Section>
            <h2>📈 Visão Estratégica</h2>
            <ChartGrid>
                <ChartCard title="Funil de Conversão (Pipeline)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={funilPipeline} layout="vertical">
                            <XAxis type="number" />
                            <YAxis dataKey="etapa" type="category" width={150} />
                            <Tooltip />
                            <Bar dataKey="total" fill="#0088FE">
                                <LabelList dataKey="total" position="right" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Top 5 Produtos Vendidos">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={produtosVendidos}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {produtosVendidos.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </ChartGrid>
        </Section>
    );
};

export default StrategicCharts;
