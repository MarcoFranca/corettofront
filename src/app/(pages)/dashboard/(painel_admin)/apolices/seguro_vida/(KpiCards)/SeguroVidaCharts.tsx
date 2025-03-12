"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import {CardCharts} from "@/app/(pages)/dashboard/(painel_admin)/apolices/plano_saude/(kpicards)/KpiCards.styles";

interface SeguroVidaChartsProps {
    stats: {
        por_administradora: Record<string, number>;
    };
}

const SeguroVidaCharts: React.FC<SeguroVidaChartsProps> = ({ stats }) => {
    const data = {
        labels: Object.keys(stats.por_administradora),
        datasets: [
            {
                label: "Apólices por Administradora",
                data: Object.values(stats.por_administradora),
                backgroundColor: ["#4BC0C0", "#FFCE56", "#36A2EB", "#FF6384"],
            },
        ],
    };

    return (
        <CardCharts>
            <h3>Distribuição por Administradora</h3>
            <Bar data={data} />
        </CardCharts>
    );
};

export default SeguroVidaCharts;
