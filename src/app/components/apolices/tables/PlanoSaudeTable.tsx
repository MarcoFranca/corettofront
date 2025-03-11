"use client";

import React from "react";
import {
    TableContainer,
    StyledTable,
    TableHeader,
    TableRow,
    TableData,
    StatusBadge, TableDataContent
} from "@/app/components/apolices/tables/PlanoSaudeTable.styles";
import {
    DeleteButton,
    DetailsButton, DetailsCoparticipacao,
    TableActions,
    ViewButton
} from "@/app/components/apolices/tables/ApoliceTable.styles";
import { FaFilePdf, FaInfoCircle, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { message, Modal } from "antd";
import api from "@/app/api/axios";
import { formatCPFOrCNPJ, formatCurrency } from "@/utils/maskUtils";
import { formatDateBR, formatDateRelative } from "@/utils/format";
import {ApolicePlanoSaude} from "@/types/ApolicesInterface";
import {useRouter} from "next/navigation";

interface ApolicesTableProps {
    apolices: ApolicePlanoSaude[];
    setApolices: (apolices: ApolicePlanoSaude[]) => void;
}

const ApolicesTable: React.FC<ApolicesTableProps> = ({ apolices, setApolices }) => {
    const router = useRouter(); // ✅ Hook do Next.js para navegação

    // 🗑️ Função para deletar apólice
    const handleDelete = async (apoliceId: string) => {
        Modal.confirm({
            title: "Tem certeza que deseja excluir esta apólice?",
            content: "Esta ação não pode ser desfeita!",
            okText: "Sim, excluir",
            okType: "danger",
            cancelText: "Cancelar",
            async onOk() {
                try {
                    await api.delete(`/apolices/${apoliceId}/`);
                    setApolices(apolices.filter(apolice => apolice.id !== apoliceId));
                    message.success("Apólice excluída com sucesso!");
                } catch (error) {
                    console.error("Erro ao excluir apólice:", error);
                    message.error("Erro ao excluir apólice. Tente novamente.");
                }
            }
        });
    };

    // 🔍 Função para redirecionar para os detalhes da apólice
    const handleDetailsClick = (id: string) => {
        router.push(`/dashboard/apolices/${id}`);
    };

    return (
        <TableContainer>
            <StyledTable>
                <thead>
                <tr>
                    <TableHeader>Nº Apólice</TableHeader>
                    <TableHeader>Nome do Cliente</TableHeader>
                    <TableHeader>Documento</TableHeader>
                    <TableHeader>Administradora</TableHeader>
                    <TableHeader>Contratação</TableHeader>
                    <TableHeader>Categoria</TableHeader>
                    <TableHeader>Acomodação</TableHeader>
                    <TableHeader>Abrangência</TableHeader>
                    <TableHeader>Beneficiários</TableHeader>
                    <TableHeader>Valor Mensal</TableHeader>
                    <TableHeader>Próxima Revisão</TableHeader>
                    <TableHeader>Coparticipação</TableHeader>
                    <TableHeader>Ações</TableHeader>
                </tr>
                </thead>
                <tbody>
                {apolices.map((apolice) => (
                    <TableRow key={apolice.id}>
                        <TableData>{apolice.numero_apolice}</TableData>
                        <TableData>{apolice.numero_apolice}</TableData>
                        <TableData>{formatCPFOrCNPJ(apolice.cpf_cnpj || "N/A")}</TableData>
                        <TableData>{apolice.administradora_nome || "N/A"}</TableData>
                        <TableData>{apolice.tipo_contratante === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}</TableData>
                        <TableData>{apolice.categoria || "N/A"}</TableData>
                        <TableData>{apolice.acomodacao || "N/A"}</TableData>
                        <TableData>{apolice.abrangencia || "N/A"}</TableData>
                        <TableData>
                            <TableDataContent>
                                {apolice.beneficiarios?.length || 0}
                            </TableDataContent>
                        </TableData>
                        <TableData>{formatCurrency(apolice.premio_pago || 0)}</TableData>
                        <TableData title={formatDateBR(apolice.data_revisao ?? null)}>
                            <TableDataContent>
                                {formatDateRelative(apolice.data_revisao || "N/A")}
                            </TableDataContent>
                        </TableData>
                        <TableData>
                            <DetailsCoparticipacao>
                                {apolice.coparticipacao ? (
                                    <FaCheckCircle style={{ color: "#4caf50"}} />
                                ) : (
                                    <FaTimesCircle style={{ color: "#ff6c61"}} />
                                )}
                            </DetailsCoparticipacao>
                        </TableData>
                        <TableActions>
                            {apolice.arquivo ? (
                                <ViewButton onClick={() => window.open(apolice.arquivo, "_blank")}>
                                    <FaFilePdf />
                                </ViewButton>
                            ) : (
                                <ViewButton disabled>
                                    <FaFilePdf />
                                </ViewButton>
                            )}

                            {/* 🔍 Botão de detalhes */}
                            <DetailsButton onClick={() => handleDetailsClick(apolice.id)}>
                                <FaInfoCircle />
                            </DetailsButton>

                            <DeleteButton onClick={() => handleDelete(apolice.id)}>
                                <FaTrash />
                            </DeleteButton>
                        </TableActions>
                    </TableRow>
                ))}
                </tbody>
            </StyledTable>
        </TableContainer>
    );
};

export default ApolicesTable;
