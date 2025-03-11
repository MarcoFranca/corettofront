"use client";

import React from "react";
import { formatCurrency } from "@/utils/maskUtils";
import { formatDateBR } from "@/utils/format";
import {
    DetailsContainer,
    Section,
    SectionContent,
    Label,
    Value,
    BeneficiarioList,
    BeneficiarioItem,
    DownloadButton,
    StatusBadge, ActionButtons
} from "./ApoliceDetalhes.styles";
import {
    FaArrowLeft, FaFileDownload, FaUser, FaShieldAlt, FaMoneyBillWave, FaFileContract, FaListAlt
} from "react-icons/fa";
import { ApoliceSeguroVida } from "@/types/ApolicesInterface";
import { useRouter } from "next/navigation";

interface SeguroVidaDetalhesProps {
    apolice: ApoliceSeguroVida;
}

const SeguroVidaDetalhes: React.FC<SeguroVidaDetalhesProps> = ({ apolice }) => {
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
                <h3>🛡️ Informações Gerais</h3>
                <SectionContent>
                    <div>
                        <Label>Número da Apólice:</Label>
                        <Value>{apolice.numero_apolice || "N/A"}</Value>

                        <Label>Cliente:</Label>
                        <Value>{`${apolice.cliente_nome} ${apolice.cliente_sobre_nome}` || "N/A"}</Value>

                        <Label>Administradora:</Label>
                        <Value>{apolice.administradora_nome || "N/A"}</Value>
                    </div>
                    <div>
                        <Label>Tipo Contratante:</Label>
                        <Value>{apolice.tipo_contratante === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</Value>

                        <Label>CPF/CNPJ:</Label>
                        <Value>{apolice.cpf_cnpj || "N/A"}</Value>

                        <Label>Status:</Label>
                        <StatusBadge color={apolice.status === "ativa" ? "#28a745" : "#dc3545"}>
                            {apolice.status.charAt(0).toUpperCase() + apolice.status.slice(1)}
                        </StatusBadge>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Pagamentos e Datas */}
            <Section>
                <h3>📅 Pagamento e Datas</h3>
                <SectionContent>
                    <div>
                        <Label>Data de Início:</Label>
                        <Value>{formatDateBR(apolice.data_inicio)}</Value>

                        <Label>Data de Vencimento:</Label>
                        <Value>{apolice.vitalicia ? "Vitalícia" : formatDateBR(apolice.data_vencimento ?? null)}</Value>

                        <Label>Data de Revisão:</Label>
                        <Value>{formatDateBR(apolice.data_revisao ?? null)}</Value>
                    </div>
                    <div>
                        <Label>Forma de Pagamento:</Label>
                        <Value>{apolice.forma_pagamento || "N/A"}</Value>

                        <Label>Periodicidade:</Label>
                        <Value>{apolice.periodicidade_pagamento || "N/A"}</Value>

                        <Label>Prêmio Pago:</Label>
                        <Value>{formatCurrency(apolice.premio_pago)}</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Características do Seguro */}
            <Section>
                <h3>🛡️ Características do Seguro</h3>
                <SectionContent>
                    <div>
                        <Label>Subcategoria:</Label>
                        <Value>{apolice.subcategoria || "N/A"}</Value>

                        <Label>Classe de Ajuste:</Label>
                        <Value>{apolice.classe_ajuste || "N/A"}</Value>

                        <Label>Período de Vigência:</Label>
                        <Value>{apolice.periodo_vigencia ? "Sim" : "Não"}</Value>
                    </div>
                    <div>
                        <Label>Total do Capital Segurado:</Label>
                        <Value>{formatCurrency(apolice.capital_segurado_total ? apolice.capital_segurado_total : 0)}</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Beneficiários */}
            <Section>
                <h3>👨‍👩‍👧 Beneficiários</h3>
                <BeneficiarioList>
                    {apolice.beneficiarios?.length ? (
                        apolice.beneficiarios.map((beneficiario) => (
                            <BeneficiarioItem key={beneficiario.id}>
                                <FaUser /> <strong>{beneficiario.nome}</strong> - {beneficiario.idade} anos
                                <br />
                                Percentual: {beneficiario.percentual}%
                            </BeneficiarioItem>
                        ))
                    ) : (
                        <p>❌ Nenhum beneficiário cadastrado.</p>
                    )}
                </BeneficiarioList>
            </Section>

            {/* 🔹 Coberturas */}
            <Section>
                <h3>📜 Coberturas</h3>
                <BeneficiarioList>
                    {apolice.coberturas?.length ? (
                        apolice.coberturas.map((cobertura) => (
                            <BeneficiarioItem key={cobertura.id}>
                                <FaListAlt /> <strong>{cobertura.nome.nome}</strong>
                                <br />
                                {cobertura.subclasse ? <><Label>Subclasse:</Label> <Value>{cobertura.subclasse}</Value>
                                </> : <></> }
                                <Label>Capital Segurado:</Label> <Value>{formatCurrency(cobertura.capital_segurado)}</Value>
                            </BeneficiarioItem>
                        ))
                    ) : (
                        <p>❌ Nenhuma cobertura cadastrada.</p>
                    )}
                </BeneficiarioList>
            </Section>

            {/* 🔹 Arquivo da Apólice */}
            {apolice.arquivo && (
                <Section>
                    <h3>📂 Documento da Apólice</h3>
                    <DownloadButton href={apolice.arquivo} target="_blank">
                        <FaFileDownload /> Baixar Apólice
                    </DownloadButton>
                </Section>
            )}
        </DetailsContainer>
    );
};

export default SeguroVidaDetalhes;
