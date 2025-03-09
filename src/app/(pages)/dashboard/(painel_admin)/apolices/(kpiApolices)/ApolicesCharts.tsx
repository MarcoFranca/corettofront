"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import {Card, ChartContainer} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(kpiApolices)/Dashboard.styles";

interface ApolicesChartsProps {
    stats: {
        apolices: {
            por_tipo: {
                "planosaude": number,
                "segurovida": number,
                "previdencia": number,
                "consorcio": number,
                "investimento": number,
                "seguroprofissional": number,
                "seguroresidencial": number
            }
        };
    };
}

const ApolicesCharts: React.FC<ApolicesChartsProps> = ({ stats }) => {
    if (!stats) return null;


    const { por_tipo } = stats.apolices;

    const data = {
        labels: ["Plano Saúde",
            "Seguro Vida",
            "Previdência",
            "Consórcio",
            "Investimento",
            "Seguro Profissional",
            "Seguro Residencial"],
        datasets: [
            {
                label: 'Apólices por Tipo',
                data: [
                    stats.apolices.por_tipo.planosaude || 0,
                    stats.apolices.por_tipo.segurovida || 0,
                    stats.apolices.por_tipo.previdencia || 0,
                    stats.apolices.por_tipo.consorcio || 0,
                    stats.apolices.por_tipo.investimento || 0,
                    stats.apolices.por_tipo.seguroprofissional || 0,
                    stats.apolices.por_tipo.seguroresidencial || 0
                ],
                backgroundColor: ["#FFB1C1", "#4BC0C0", "#FFCE56", "#36A2EB", "#9966FF", "#FF9F40", "#4BC0C0"],
            },
        ],
    };

    return (
        <ChartContainer >
            <h3>📈 Apólices por Tipo</h3>
            <Bar data={data} />
        </ChartContainer>
    );
};

export default ApolicesCharts;
