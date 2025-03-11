"use client";

import React from "react";
import {FaListAlt, FaMoneyBillWave, FaPercent, FaCalendar, FaArrowLeft} from "react-icons/fa";
import { formatCurrency } from "@/utils/maskUtils";
import { formatDateBR } from "@/utils/format";
import {
    DetailsContainer,
    Section,
    SectionContent,
    Label,
    Value,
    ActionButtons,
} from "./ApoliceDetalhes.styles";
import { ApoliceConsorcio } from "@/types/ApolicesInterface";
import {useRouter} from "next/navigation";

interface ConsorcioDetalhesProps {
    apolice: ApoliceConsorcio;
}

const ConsorcioDetalhes: React.FC<ConsorcioDetalhesProps> = ({ apolice }) => {
    const router = useRouter();

    return (
        <DetailsContainer>
            {/* 🔹 Botão de voltar */}
            <ActionButtons>
                <button onClick={() => router.back()} className="back-btn">
                    <FaArrowLeft /> Voltar
                </button>
            </ActionButtons>
            {/* 🔹 Informações Gerais */}
            <Section>
                <h3>📄 Informações Gerais</h3>
                <SectionContent>
                    <div>
                        <Label>Número da Apólice:</Label> <Value>{apolice.numero_apolice}</Value>
                        <Label>Cliente:</Label> <Value>{apolice.cliente_nome} {apolice.cliente_sobre_nome}</Value>
                        <Label>Administradora:</Label> <Value>{apolice.administradora_nome}</Value>
                    </div>
                    <div>
                        <Label>Grupo:</Label> <Value>{apolice.grupo}</Value>
                        <Label>Cota:</Label> <Value>{apolice.cota}</Value>
                        <Label>Prazo:</Label> <Value>{apolice.prazo} meses</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Pagamentos e Saldo */}
            <Section>
                <h3>💰 Pagamentos e Saldo</h3>
                <SectionContent>
                    <div>
                        <Label>Valor Total:</Label> <Value>{formatCurrency(apolice.valor_total)}</Value>
                        <Label>Valor Parcela:</Label> <Value>{formatCurrency(apolice.premio_pago)}</Value>
                        <Label>Saldo Devedor:</Label> <Value>{formatCurrency(apolice.saldo_devedor)}</Value>
                    </div>
                    <div>
                        <Label>Parcelas Pagas:</Label> <Value>{apolice.parcelas_pagas}</Value>
                        <Label>Parcela Reduzida:</Label> <Value>{apolice.parcela_reduzida ? "Sim" : "Não"}</Value>
                        <Label>Percentual de Redução:</Label> <Value>{apolice.percentual_reducao_parcela ?? "N/A"}%</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Detalhes do Consórcio */}
            <Section>
                <h3>📜 Detalhes do Consórcio</h3>
                <SectionContent>
                    <div>
                        <Label>Índice de Correção:</Label> <Value>{apolice.indice_correcao}</Value>
                        <Label>Objetivo:</Label> <Value>{apolice.objetivo}</Value>
                        <Label>Estratégia:</Label> <Value>{apolice.estrategia || "N/A"}</Value>
                        <Label>Furo:</Label> <Value>{apolice.furo || "N/A"}</Value>
                    </div>
                    <div>
                        <Label>Data Último Lance:</Label> <Value>{apolice.data_ultimo_lance ?
                        formatDateBR(apolice.data_ultimo_lance) : 'N/A'}</Value>
                        <Label>Tipo de Lance:</Label> <Value>{apolice.tipo_lance || "N/A"}</Value>
                        <Label>Detalhes do Lance:</Label> <Value>{apolice.detalhes_lance || "N/A"}</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Lances e Aportes */}
            <Section>
                <h3>⚡ Lances e Aportes</h3>
                <SectionContent>
                    <div>
                        <Label>Aporte:</Label> <Value>{formatCurrency(apolice.aporte ?? 0)}</Value>
                        <Label>Valor Final da Carta:</Label> <Value>{formatCurrency(apolice.valor_final_carta ?? 0)}</Value>
                        <Label>Valor da Carta:</Label> <Value>{formatCurrency(apolice.valor_carta)}</Value>
                    </div>
                    <div>
                        <Label>Permite Lance Fixo:</Label> <Value>{apolice.permitir_lance_fixo ? "Sim" : "Não"}</Value>
                        <Label>Permite Lance Livre:</Label> <Value>{apolice.permitir_lance_livre ? "Sim" : "Não"}</Value>
                        <Label>Permite Embutido Fixo:</Label> <Value>{apolice.permitir_embutido_fixo ? "Sim" : "Não"}</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Histórico de Pagamentos */}
            <Section>
                <h3>📆 Histórico de Pagamentos</h3>
                <SectionContent>
                    <div>
                        <Label>Reajustes:</Label>
                        {apolice.historico_reajustes
                            ? Object.entries(apolice.historico_reajustes).map(([data, valor]) => (
                                <Value key={data}><FaCalendar /> {formatDateBR(data)} - {formatCurrency(valor)}</Value>
                            ))
                            : <Value>Sem histórico</Value>}
                    </div>
                    <div>
                        <Label>Pagamentos:</Label>
                        {apolice.historico_pagamentos
                            ? Object.entries(apolice.historico_pagamentos).map(([data, valor]) => (
                                <Value key={data}><FaMoneyBillWave /> {formatDateBR(data)} - {formatCurrency(valor)}</Value>
                            ))
                            : <Value>Sem pagamentos registrados</Value>}
                    </div>
                </SectionContent>
            </Section>
        </DetailsContainer>
    );
};

export default ConsorcioDetalhes;
