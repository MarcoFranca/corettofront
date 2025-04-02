import React from "react";
import { OverviewContainer, OverviewText } from "./ApolicesOverview.styles";
import { ApolicesAgrupadas } from "@/types/ApolicesInterface"; // ou onde você colocou a interface

interface ApolicesOverviewProps {
    apolices: ApolicesAgrupadas;
}


const ApolicesOverview: React.FC<ApolicesOverviewProps> = ({ apolices }) => {
    const todasApolices = Object.values(apolices).flat();
    const totalValor = todasApolices.reduce(
        (acc, apolice) => acc + parseFloat(String(apolice.premio_pago) || "0"),
        0
    );
    const totalApolices = todasApolices.length;

    return (
        <OverviewContainer>
            <h3>📊 Panorama</h3>
            <OverviewText>🔢 Total de Apólices: {totalApolices}</OverviewText>
            <OverviewText>💰 Valor Total: R$ {totalValor.toFixed(2)}</OverviewText>
        </OverviewContainer>
    );
};

export default ApolicesOverview;
