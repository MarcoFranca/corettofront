import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import styled from "styled-components";

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

const ChartsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 20px;
    flex-wrap: wrap;
`;

const ChartCard = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 48%;
    min-width: 300px;
`;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FF6666", "#66B3FF"];

const Charts: React.FC<StatsProps> = ({ stats }) => {
    // Dados para gráfico de barras
    const barData = [
        { name: "Clientes", total: stats.clientes.total },
        { name: "Apólices", total: stats.apolices.total },
    ];

    // Dados para gráfico de pizza (Apólices por tipo)
    const pieData = Object.entries(stats.apolices.por_tipo)
        .map(([tipo, total], index) => ({
            name: tipo.replace("_", " ").toUpperCase(),
            value: total,
            color: COLORS[index % COLORS.length]
        }))
        .filter((item) => item.value > 0); // Remove tipos sem apólices

    return (
        <ChartsContainer>
            {/* 📊 Gráfico de Barras */}
            <ChartCard>
                <h3>📊 Comparação: Clientes x Apólices</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#0088FE" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* 🥧 Gráfico de Pizza */}
            <ChartCard>
                <h3>🥧 Distribuição de Apólices</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
        </ChartsContainer>
    );
};

export default Charts;
