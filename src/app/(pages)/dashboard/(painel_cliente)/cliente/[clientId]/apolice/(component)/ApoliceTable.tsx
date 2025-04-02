import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Importação do useRouter para navegação
import {FaInfoCircle, FaTrash, FaFilePdf, FaEdit} from "react-icons/fa";
import {
    Table, TableHeader, TableRow, TableData, TableActions, DetailsButton, DeleteButton, ViewButton, StatusBadge, TableContainer
} from "./ApoliceTable.styles";
import api from "@/app/api/axios";
import {formatMoney} from "@/utils/maskUtils"; // 🔥 Importando API para buscar administradoras
import { message, Modal } from "antd"; // 🔥 Importamos `message` e `Modal` do Ant Design
import { ApoliceDetalhada } from "@/types/ApolicesInterface"; // ou onde estiver

interface ApoliceTableProps {
    apolices: ApoliceDetalhada[];
    setApolices: (apolices: ApoliceDetalhada[]) => void;
    onEdit: (apolice: ApoliceDetalhada) => void;
}

// Função para definir a cor do status
const getStatusColor = (status: string) => {
    switch (status) {
        case "ativa":
            return "#28a745"; // Verde
        case "atrasada":
            return "#dc3545"; // Vermelho
        case "saldado":
            return "#6c757d"; // Cinza
        case "cancelada":
        case "falecimento":
            return "#343a40"; // Preto
        case "inadimplente":
            return "#ffc107"; // Amarelo
        case "doenca":
            return "#fd7e14"; // Laranja
        case "resgate":
            return "#007bff"; // Azul
        default:
            return "#6c757d"; // Cor padrão (cinza)
    }
};

const ApoliceTable: React.FC<ApoliceTableProps> = ({ apolices, setApolices, onEdit }) => {
    const router = useRouter(); // ✅ Hook do Next.js para navegação
    const [administradoras, setAdministradoras] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchAdministradoras = async () => {
            try {
                const response = await api.get("/administradoras/"); // 🔥 Ajuste a URL conforme o backend
                const adminMap: Record<string, string> = {};
                response.data.forEach((admin: { id: string; nome: string }) => {
                    adminMap[admin.id] = admin.nome;
                });
                setAdministradoras(adminMap);
            } catch (error) {
                console.error("Erro ao buscar administradoras:", error);
            }
        };

        fetchAdministradoras();
    }, []);


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

    // 🔍 Função para redirecionar para os detalhes da apólice
    const handleDetailsClick = (id: string) => {
        router.push(`/dashboard/apolices/${id}`);
    };

    return (
        <TableContainer>
            <Table>
                <thead>
                <TableRow>
                    <TableHeader>Número</TableHeader>
                    <TableHeader>Produto</TableHeader>
                    <TableHeader>Nome</TableHeader>
                    <TableHeader>Administradora</TableHeader>
                    <TableHeader>Pagamento</TableHeader>
                    <TableHeader>Valor</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Ações</TableHeader>
                </TableRow>
                </thead>
                <tbody>
                {apolices.length > 0 ? (
                    apolices.map((apolice) => (
                        <TableRow key={apolice.id}>
                            <TableData>{apolice.numero_apolice || "N/A"}</TableData>
                            <TableData>{apolice.tipo_produto || "N/A"}</TableData>
                            <TableData>{apolice.cliente_nome + apolice.cliente_sobre_nome || "N/A"}</TableData>
                            <TableData>{administradoras[apolice.administradora] || "N/A"}</TableData>
                            <TableData>{apolice.forma_pagamento || "N/A"}</TableData>
                            <TableData>{apolice.premio_pago_money ? `R$ ${formatMoney(apolice.premio_pago_money)}` : "N/A"}</TableData>
                            <TableData>
                                <StatusBadge color={getStatusColor(apolice.status || "indefinido")}>
                                    {apolice.status ? apolice.status.charAt(0).toUpperCase() + apolice.status.slice(1) : "Indefinido"}
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
                                <DetailsButton onClick={() => handleDetailsClick(apolice.id)}>
                                    <FaInfoCircle />
                                </DetailsButton>

                                <DetailsButton onClick={() => onEdit(apolice)}>
                                    <FaEdit />
                                </DetailsButton>

                                {/* 🗑 Botão de deletar */}
                                <DeleteButton onClick={() => handleDelete(apolice.id)}>
                                    <FaTrash />
                                </DeleteButton>
                            </TableActions>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableData colSpan={8} style={{ textAlign: "center", fontStyle: "italic" }}>
                            Nenhuma apólice encontrada.
                        </TableData>
                    </TableRow>
                )}
                </tbody>
            </Table>
        </TableContainer>
    );
};

export default ApoliceTable;
