"use client";

import React from "react";
import { formatCPFOrCNPJ, formatCurrency } from "@/utils/maskUtils";
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
    StatusBadge, ActionButtons, BeneficiarioContent
} from "./ApoliceDetalhes.styles";
import {
    FaArrowLeft,
    FaFileDownload,
    FaUser,
    FaBuilding,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaNotesMedical,
    FaUserCheck,
    FaBirthdayCake,
    FaHospitalUser,
    FaUserClock,
    FaUserFriends,
    FaUserInjured,
    FaUserNurse,
    FaMoneyCheckAlt,
    FaIdCard, FaIdCardAlt, FaRegImage
} from "react-icons/fa";
import { ApolicePlanoSaude } from "@/types/ApolicesInterface";
import { useRouter } from "next/navigation";

interface PlanoSaudeDetalhesProps {
    apolice: ApolicePlanoSaude;
}

const PlanoSaudeDetalhes: React.FC<PlanoSaudeDetalhesProps> = ({ apolice }) => {
    const router = useRouter();

    return (
        <DetailsContainer>
            {/* 🔹 Botões de ação */}
            <ActionButtons>
                <button onClick={() => router.back()} className="back-btn">
                    <FaArrowLeft /> Voltar
                </button>
            </ActionButtons>

            {/* 🔹 Informações Gerais */}
            <Section>
                <h3><FaUser color={'#007bff'}  /> Informações Gerais</h3>
                <SectionContent>
                    <div>
                        <Label><FaNotesMedical color={"#007bff"} /> Número da Apólice:</Label>
                        <Value>{apolice.numero_apolice || "N/A"}</Value>

                        <Label><FaIdCardAlt color={"#007bff"} /> Cliente:</Label>
                        <Value>{`${apolice.cliente_nome} ${apolice.cliente_sobre_nome}` || "N/A"}</Value>

                        <Label><FaBuilding color={"#007bff"} /> Administradora:</Label>
                        <Value>{apolice.administradora_nome || "N/A"}</Value>
                    </div>
                    <div>
                        <Label><FaRegImage color={'#007bff'}  /> Tipo Contratante:</Label>
                        <Value>{apolice.tipo_contratante === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</Value>

                        <Label><FaIdCard color={'#007bff'}  /> CPF/CNPJ:</Label>
                        <Value>{formatCPFOrCNPJ(apolice.cpf_cnpj || "N/A")}</Value>

                        <Label>Status:</Label>
                        <StatusBadge color={apolice.status === "ativa" ? "#28a745" : "#dc3545"}>
                            {apolice.status.charAt(0).toUpperCase() + apolice.status.slice(1)}
                        </StatusBadge>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Pagamentos e Datas */}
            <Section>
                <h3><FaCalendarAlt color={'#007bff'}  /> Pagamento e Datas</h3>
                <SectionContent>
                    <div>
                        <Label><FaUserClock color={'#007bff'}/> Data de Início:</Label>
                        <Value>{formatDateBR(apolice.data_inicio)}</Value>

                        <Label><FaUserClock color={'#007bff'}/> Data de Vencimento:</Label>
                        <Value>{apolice.vitalicia ? "Vitalícia" : formatDateBR(apolice.data_vencimento ?? null)}</Value>

                        <Label><FaUserClock color={'#007bff'}/> Data de Revisão:</Label>
                        <Value>{formatDateBR(apolice.data_revisao ?? null)}</Value>
                    </div>
                    <div>
                        <Label><FaMoneyCheckAlt color={'#007bff'}/> Forma de Pagamento:</Label>
                        <Value>{apolice.forma_pagamento || "N/A"}</Value>

                        <Label><FaUserClock color={'#007bff'}  /> Periodicidade:</Label>
                        <Value>{apolice.periodicidade_pagamento || "N/A"}</Value>

                        <Label><FaMoneyBillWave color={'#007bff'}  /> Valor Mensal:</Label>
                        <Value>{formatCurrency(apolice.premio_pago_money)}</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Características do Plano */}
            <Section>
                <h3> <FaNotesMedical color={'#007bff'}  /> Características do Plano</h3>
                <SectionContent>
                    <div>
                        <Label><FaUserInjured color={'#007bff'}/> Categoria:</Label>
                        <Value>{apolice.categoria || "N/A"}</Value>

                        <Label><FaUserNurse color={'#007bff'}/> Acomodação:</Label>
                        <Value>{apolice.acomodacao || "N/A"}</Value>

                        <Label><FaUserCheck color={'#007bff'}  /> Coparticipação:</Label>
                        <Value>{apolice.coparticipacao ? "Sim" : "Não" }</Value>
                    </div>
                    <div>
                        <Label><FaHospitalUser color={'#007bff'}/> Abrangência:</Label>
                        <Value>{apolice.abrangencia || "N/A"}</Value>

                        <Label><FaMoneyBillWave color={'#007bff'}  /> Valor Reembolso Consulta:</Label>
                        <Value>{formatCurrency(apolice.valor_reembolso_consulta_money ?? 0)}</Value>
                    </div>
                </SectionContent>
            </Section>

            {/* 🔹 Beneficiários */}
            <Section>
                <h3><FaUserFriends color={'#007bff'}  /> Beneficiários</h3>
                <BeneficiarioList>
                    {apolice.beneficiarios?.length ? (
                        apolice.beneficiarios.map((beneficiario) => (
                            <BeneficiarioItem key={beneficiario.id}>
                                <BeneficiarioContent>
                                    <p>
                                    <FaUser color={'#007bff'}  /> <strong>{beneficiario.nome}</strong> - {beneficiario.parentesco}
                                    </p>
                                    <p>
                                    <FaBirthdayCake color={"#007bff"} /> <strong>idade:</strong> {beneficiario.idade} Anos
                                    </p>
                                </BeneficiarioContent>
                            </BeneficiarioItem>
                        ))
                    ) : (
                        <p>❌ Nenhum beneficiário cadastrado.</p>
                    )}
                </BeneficiarioList>
            </Section>

            {/* 🔹 Arquivo da Apólice */}
            {apolice.arquivo && (
                <Section>
                    <h3><FaFileDownload color={'#007bff'}  /> Documento da Apólice</h3>
                    <DownloadButton href={apolice.arquivo} target="_blank">
                        <FaFileDownload /> Baixar Apólice
                    </DownloadButton>
                </Section>
            )}
        </DetailsContainer>
    );
};

export default PlanoSaudeDetalhes;
