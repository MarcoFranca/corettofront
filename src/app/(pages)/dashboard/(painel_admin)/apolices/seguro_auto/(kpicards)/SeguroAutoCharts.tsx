import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { CardCharts } from "./KpiCards.styles";

interface SeguroAutoChartsProps {
    stats: {
        por_seguradora: Record<string, number>;
    };
}

const SeguroAutoCharts: React.FC<SeguroAutoChartsProps> = ({ stats }) => {
    const data = {
        labels: Object.keys(stats.por_seguradora),
        datasets: [
            {
                label: "Apólices por Seguradora",
                data: Object.values(stats.por_seguradora),
                backgroundColor: ["#33cccc", "#4BC0C0", "#36A2EB", "#FF6384"],
            },
        ],
    };

    return (
        <CardCharts>
            <h3>Distribuição por Seguradora</h3>
            <Bar data={data} />
        </CardCharts>
    );
};

export default SeguroAutoCharts;
