'use client';
import React from "react";
import { HeartFilled } from "@ant-design/icons";
import {
    CardTitle,
    CardValue,
    InfoCard
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/ClientDetailPage.styles";

interface SaudeInfoCardProps {
    saude?: any;
    onClick?: () => void;
}

const SaudeInfoCard: React.FC<SaudeInfoCardProps> = ({ saude, onClick }) => {
    return (
        <InfoCard $clickable onClick={onClick}>
            <CardTitle>
                <HeartFilled style={{ color: "#ff6b6b" }} /> Saúde
            </CardTitle>
            <CardValue>
                {saude
                    ? (
                        <>
                            {saude.peso ? `${saude.peso}kg` : "-"}{saude.altura && `, ${saude.altura}m`}
                            {saude.imc && `, IMC: ${saude.imc} (${saude.imc_grau || "-"})`}
                        </>
                    )
                    : "Não informado"}
            </CardValue>
        </InfoCard>
    );
};

export default SaudeInfoCard;
