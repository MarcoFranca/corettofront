"use client";

import React from "react";
import {
    TableContainer,
    StyledTable,
    TableHeader,
    TableRow,
    TableData,
    StatusBadge,
    TableDataContent
} from "@/app/components/apolices/tables/PlanoSaudeTable.styles";
import {
    DeleteButton,
    DetailsButton,
    TableActions,
    ViewButton
} from "@/app/components/apolices/tables/ApoliceTable.styles";
import { FaFilePdf, FaInfoCircle, FaTrash } from "react-icons/fa";
import { message, Modal } from "antd";
import api from "@/app/api/axios";
import { formatCurrency } from "@/utils/maskUtils";
import { formatDateBR, formatDateRelative } from "@/utils/format";
import { ApoliceSeguroAuto } from "@/types/ApolicesInterface";
import { useRouter } from "next/navigation";

interface SeguroAutoTableProps {
    apolices: ApoliceSeguroAuto[];
    setApolices: (apolices: ApoliceSeguroAuto[]) => void;
}

const SeguroAutoTable: React.FC<SeguroAutoTableProps> = ({ apolices, setApolices }) => {
    const router = useRouter();

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

    const handleDetailsClick = (id: string) => {
        router.push(`/dashboard/apolices/${id}`);
    };

    return (
        <TableContainer>
            <StyledTable>
                <thead>
                <tr>
                    <TableHeader>Nº Apólice</TableHeader>
                    <TableHeader>Cliente</TableHeader>
                    <TableHeader>Placa</TableHeader>
                    <TableHeader>Marca</TableHeader>
                    <TableHeader>Modelo</TableHeader>
                    <TableHeader>Ano</TableHeader>
                    <TableHeader>Valor do Veículo</TableHeader>
                    <TableHeader>Tipo de Cobertura</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Valor Prêmio</TableHeader>
                    <TableHeader>Franquia</TableHeader>
                    <TableHeader>Revisão</TableHeader>
                    <TableHeader>Ações</TableHeader>
                </tr>
                </thead>
                <tbody>
                {apolices.map((apolice) => (
                    <TableRow key={apolice.id}>
                        <TableData>{apolice.numero_apolice}</TableData>
                        <TableData>{apolice.cliente_nome}</TableData>
                        <TableData>{apolice.placa || "N/A"}</TableData>
                        <TableData>{apolice.marca || "N/A"}</TableData>
                        <TableData>{apolice.modelo || "N/A"}</TableData>
                        <TableData>{apolice.ano_modelo || "N/A"}</TableData>
                        <TableData>{formatCurrency(Number(apolice.valor_veiculo) || 0)}</TableData>
                        <TableData>{apolice.tipo_cobertura || "N/A"}</TableData>
                        <TableData>
                            <StatusBadge color={apolice.status === "ativa" ? "#4caf50" : "#ff6c61"}>
                                {apolice.status || "N/A"}
                            </StatusBadge>
                        </TableData>
                        <TableData>{formatCurrency(Number(apolice.premio_pago_money) || 0)}</TableData>
                        <TableData>{apolice.franquia || "N/A"}</TableData>
                        <TableData title={formatDateBR(apolice.data_revisao ?? null)}>
                            <TableDataContent>
                                {formatDateRelative(apolice.data_revisao || "N/A")}
                            </TableDataContent>
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

export default SeguroAutoTable;
