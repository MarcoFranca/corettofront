"use client";

import React from "react";
import { ApolicePlanoSaude} from "@/types/interfaces";
import {
    TableContainer,
    StyledTable,
    TableHeader,
    TableRow,
    TableData,
    StatusBadge
} from "@/app/components/apolices/tables/PlanoSaudeTable.styles";
import {
    DeleteButton,
    DetailsButton,
    TableActions,
    ViewButton
} from "@/app/components/apolices/tables/ApoliceTable.styles";
import {FaFilePdf, FaInfoCircle, FaTrash} from "react-icons/fa";
import {message, Modal} from "antd";
import api from "@/app/api/axios";

interface ApolicesTableProps {
    apolices: ApolicePlanoSaude[];
    setApolices: (apolices: ApolicePlanoSaude[]) => void; // ✅ Agora passamos `setApolices` para atualizar a lista

}


const ApolicesTable: React.FC<ApolicesTableProps> = ({ apolices, setApolices }) => {

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
                    await api.delete(`/apolices/${apoliceId}/`); // 🔥 Ajuste o endpoint conforme necessário
                    setApolices(apolices.filter(apolice => apolice.id !== apoliceId)); // ✅ Remove a apólice da lista
                    message.success("Apólice excluída com sucesso!");
                } catch (error) {
                    console.error("Erro ao excluir apólice:", error);
                    message.error("Erro ao excluir apólice. Tente novamente.");
                }
            }
        });
    };

    return (
        <TableContainer>
            <StyledTable>
                <thead>
                <tr>
                    <TableHeader>Nº Apólice</TableHeader>
                    <TableHeader>Cliente (CPF/CNPJ)</TableHeader>
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
                        <TableData>{apolice.cpf_cnpj || "N/A"}</TableData>
                        <TableData>{apolice.administradora_nome || "N/A"}</TableData>
                        <TableData>{apolice.tipo_contratante === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}</TableData>
                        <TableData>{apolice.categoria || "N/A"}</TableData>
                        <TableData>{apolice.acomodacao || "N/A"}</TableData>
                        <TableData>{apolice.abrangencia || "N/A"}</TableData>
                        <TableData>{apolice.beneficiarios?.length || 0}</TableData>
                        <TableData>R$ {(Number(apolice.premio_pago) || 0).toFixed(2)}</TableData>
                        <TableData>{apolice.data_revisao || "N/A"}</TableData>
                        <TableData>
                            <StatusBadge color={apolice.coparticipacao ? "#4caf50" : "#ff6c61"}>
                                {apolice.coparticipacao ? "✅ Sim" : "❌ Não"}
                            </StatusBadge>
                        </TableData>
                        <TableActions>
                            {/* 🔍 Botão de visualizar apólice (arquivo PDF) */}
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
                            <DetailsButton>
                                <FaInfoCircle />
                            </DetailsButton>

                            {/* 🗑 Botão de deletar */}
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
