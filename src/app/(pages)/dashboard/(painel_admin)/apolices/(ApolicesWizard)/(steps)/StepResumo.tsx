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
                        {typeof dadosPrincipais.cliente === "object" && dadosPrincipais.cliente !== null
                            ? String(dadosPrincipais.cliente.label ?? "Não informado")
                            : String(dadosPrincipais.cliente ?? "Não informado")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tipo da Apólice">
                        {String(dadosPrincipais.tipoApolice ?? "Não informado")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Administradora">
                        {typeof dadosPrincipais.administradora === "object" && dadosPrincipais.administradora !== null
                            ? String(dadosPrincipais.administradora.label ?? "Não informado")
                            : String(dadosPrincipais.administradora ?? "Não informado")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Número da Apólice">
                        {String(dadosPrincipais.numero_apolice ?? "Não informado")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Parceiro">
                        {typeof dadosPrincipais.parceiro === "object" && dadosPrincipais.parceiro !== null
                            ? dadosPrincipais.parceiro.label ?? "Não informado"
                            : "Não informado"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data de Início">
                        {String(dadosPrincipais.data_inicio ?? "Não informado")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data de Vencimento">
                        {dadosPrincipais.data_vencimento ? String(dadosPrincipais.dataVencimento) : "Indeterminado"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Data de Revisão">
                        {dadosPrincipais.data_revisao ? String(dadosPrincipais.dataVencimento) : "Indeterminado"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Premio Pago">
                        {dadosPrincipais.premio_pago_money ? String(dadosPrincipais.premio_pago_money) : "Indeterminado"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Periodicidade do pagamento">
                        {dadosPrincipais.periodicidade_pagamento ? String(dadosPrincipais.periodicidade_pagamento) : "Indeterminado"}
                    </Descriptions.Item>
                </Descriptions>
            </ResumoCard>

            {/* 📝 Exibir Detalhes da Apólice */}
            {dadosPrincipais.detalhes && (
                <ResumoCard>
                    <Descriptions title="Detalhes da Apólice" bordered column={1}>
                        {Object.entries(dadosPrincipais.detalhes).map(([key, value]) => (
                            <Descriptions.Item label={key} key={key}>
                                {typeof value === "object" && value !== null
                                    ? "label" in value
                                        ? String(value.label ?? "Não informado")
                                        : JSON.stringify(value, null, 2)
                                    : String(value ?? "Não informado")}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </ResumoCard>
            )}

            {/* 🛡️ Exibir Coberturas se for Seguro de Vida */}
            {dadosPrincipais.tipoApolice === "seguro_vida" && dadosPrincipais.coberturas?.length > 0 && (
                <ResumoCard>
                    <SectionTitle>🛡️ Coberturas</SectionTitle>
                    <CoberturasList>
                        {dadosPrincipais.coberturas.map((cobertura: any, index: number) => (
                            <li key={index}>
                                <strong>{String(cobertura.descricao ?? "Sem descrição")}:</strong> R$ {String(cobertura.valor ?? "0,00")}
                            </li>
                        ))}
                    </CoberturasList>
                </ResumoCard>
            )}


            {/* 🛡️ Exibir Coberturas se for Seguro de Vida */}
            {dadosPrincipais.tipoApolice === "seguro_vida" && dadosPrincipais.coberturas?.length > 0 && (
                <ResumoCard>
                    <SectionTitle>🛡️ Coberturas</SectionTitle>
                    <CoberturasList>
                        {dadosPrincipais.coberturas.map((cobertura: any, index: number) => (
                            <li key={index}>
                                <strong>{cobertura.descricao}:</strong> R$ {String(cobertura.valor)}
                            </li>
                        ))}
                    </CoberturasList>
                </ResumoCard>
            )}

        </StepContainer>
    );
};

export default StepResumo;
