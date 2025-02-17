// ApoliceTable.tsx
import React from "react";
import { Apolice } from "@/types/interfaces";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
import {
    Table, TableData, TableHeader, TableRow
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceTable.styles";

interface ApoliceTableProps {
    apolices: Apolice[];
}

const ApoliceTable: React.FC<ApoliceTableProps> = ({ apolices }) => {
    return (
        <Table>
            <TableHeader>
            <TableRow>
                <th>Número</th>
                <th>Produto</th>
                <th>Administradora</th>
                <th>Data Início</th>
                <th>Forma Pagamento</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
            </TableRow>
            </TableHeader>
            <tbody>
            {apolices.length > 0 ? (
                apolices.map((apolice) => (
                    <TableRow key={apolice.id}>
                        <TableData>{apolice.numero_apolice || "N/A"}</TableData>
                        <TableData>{apolice.produto || "N/A"}</TableData>
                        <TableData>{apolice.administradora || "N/A"}</TableData>
                        <TableData>{apolice.data_inicio ? new Date(apolice.data_inicio).toLocaleDateString() : "N/A"}</TableData>
                        <TableData>{apolice.forma_pagamento || "N/A"}</TableData>
                        <TableData>{apolice.valor ? `R$ ${apolice.valor.toFixed(2)}` : "N/A"}</TableData>
                        <TableData>{apolice.status || "N/A"}</TableData>
                        <TableData>
                            <button className="btn-details">
                                <FaInfoCircle /> Detalhes
                            </button>
                            <button className="btn-delete">
                                <FaTrash /> Deletar
                            </button>
                        </TableData>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableData colSpan={8}>Nenhuma apólice encontrada.</TableData>
                </TableRow>
            )}
            </tbody>
        </Table>
    );
};

export default ApoliceTable;
