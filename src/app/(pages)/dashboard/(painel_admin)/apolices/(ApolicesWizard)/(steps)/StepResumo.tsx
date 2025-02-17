// 📂 src/components/ApolicesWizard/steps/StepResumo.tsx
"use client";

import React from "react";
import { Descriptions } from "antd";
import {
    StepContainer,
    SectionTitle,
    ResumoCard,
    CoberturasList,
} from "./StepResumo.styles";

interface StepResumoProps {
    watch: any;
}

const StepResumo: React.FC<StepResumoProps> = ({ watch }) => {
    const dadosPrincipais = watch();

    return (
        <StepContainer>
            <SectionTitle>📄 Resumo da Apólice</SectionTitle>

            <ResumoCard>
                <Descriptions title="Dados Principais" bordered column={1}>
                    <Descriptions.Item label="Cliente">
                        {dadosPrincipais.cliente}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tipo da Apólice">
                        {dadosPrincipais.tipoApolice}
                    </Descriptions.Item>
                    <Descriptions.Item label="Administradora">
                        {dadosPrincipais.administradora}
                    </Descriptions.Item>
                    <Descriptions.Item label="Número da Apólice">
                        {dadosPrincipais.numeroApolice}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data de Início">
                        {dadosPrincipais.dataInicio}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data de Vencimento">
                        {dadosPrincipais.dataVencimento || "Indeterminado"}
                    </Descriptions.Item>
                </Descriptions>
            </ResumoCard>

            {dadosPrincipais.detalhes && (
                <ResumoCard>
                    <Descriptions title="Detalhes da Apólice" bordered column={1}>
                        {Object.entries(dadosPrincipais.detalhes).map(([key, value]) => (
                            <Descriptions.Item label={key} key={key}>
                                {String(value)}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </ResumoCard>
            )}

            {dadosPrincipais.tipoApolice === "seguro_vida" &&
                dadosPrincipais.coberturas?.length > 0 && (
                    <ResumoCard>
                        <SectionTitle>🛡️ Coberturas</SectionTitle>
                        <CoberturasList>
                            {dadosPrincipais.coberturas.map((cobertura: any, index: number) => (
                                <li key={index}>
                                    <strong>{cobertura.descricao}:</strong> R$ {cobertura.valor}
                                </li>
                            ))}
                        </CoberturasList>
                    </ResumoCard>
                )}
        </StepContainer>
    );
};

export default StepResumo;
