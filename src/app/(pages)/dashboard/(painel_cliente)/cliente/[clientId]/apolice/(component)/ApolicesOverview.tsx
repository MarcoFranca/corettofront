import React from "react";
import { Apolices } from "@/types/interfaces";
import { OverviewContainer, OverviewText } from "./ApolicesOverview.styles";

interface ApolicesOverviewProps {
    apolices: Apolices;
}

const ApolicesOverview: React.FC<ApolicesOverviewProps> = ({ apolices }) => {
    const todasApolices = Object.values(apolices).flat();
    const totalValor = todasApolices.reduce((acc, apolice) => acc + parseFloat(apolice.premio_pago || "0"), 0);
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
