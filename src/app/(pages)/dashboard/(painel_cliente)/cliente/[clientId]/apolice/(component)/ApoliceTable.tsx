import { useState } from "react";
import { Apolice } from "@/types/interfaces";
import { FaTrash } from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import ConfirmationModal from "@/app/components/Modal/ConfirmDeleteModal";
import { TableContainer, StyledTable, TableHeader, TableCell } from "./ApoliceTable.styles";

interface Props {
    apolices: Apolice[];
}

const ApoliceTable = ({ apolices }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apoliceToDelete, setApoliceToDelete] = useState<Apolice | null>(null);

    return (
        <TableContainer>
            <StyledTable>
                <thead>
                <tr>
                    <TableHeader>Número</TableHeader>
                    <TableHeader>Produto</TableHeader>
                    <TableHeader>Administradora</TableHeader>
                    <TableHeader>Data Início</TableHeader>
                    <TableHeader>Forma Pagamento</TableHeader>
                    <TableHeader>Valor</TableHeader>
                    <TableHeader>Ações</TableHeader>
                </tr>
                </thead>
                <tbody>
                {apolices.map((apolice) => (
                    <tr key={apolice.id}>
                        <TableCell>{apolice.numero_apolice}</TableCell>
                        <TableCell>{apolice.produto}</TableCell>
                        <TableCell>{apolice.administradora}</TableCell>
                        <TableCell>{new Date(apolice.data_inicio).toLocaleDateString()}</TableCell>
                        <TableCell>{apolice.forma_pagamento}</TableCell>
                        <TableCell>R$ {apolice.premio_pago}</TableCell>
                    </tr>
                ))}
                </tbody>
            </StyledTable>
        </TableContainer>
    );
};

export default ApoliceTable;
