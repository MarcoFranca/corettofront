import { useState } from "react";
import { Apolices, Apolice } from "@/types/interfaces";
import { FaDownload, FaInfoCircle, FaTrash } from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import ConfirmationModal from "@/app/components/Modal/ConfirmDeleteModal";

interface Props {
    apolices: Apolices;
    filtro: string;
    clienteId: string;
}

const ApoliceTable = ({ apolices, filtro, clienteId }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apoliceToDelete, setApoliceToDelete] = useState<Apolice | null>(null);

    const apolicesFiltradas =
        filtro === "todos"
            ? Object.values(apolices).flat().filter(apolice => apolice !== null && apolice !== undefined) // ✅ Filtra valores inválidos
            : (apolices[filtro as keyof Apolices] || []).filter(apolice => apolice !== null && apolice !== undefined);

    const handleDelete = (apolice: Apolice) => {
        setApoliceToDelete(apolice);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th>Número</th>
                    <th>Produto</th>
                    <th>Administradora</th>
                    <th>Data Início</th>
                    <th>Forma Pagamento</th>
                    <th>Valor</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {apolicesFiltradas.length > 0 ? (
                    apolicesFiltradas.map((apolice) => {
                        const apoliceObj = apolice ?? {}; // ✅ Garante que `apolice` nunca seja null

                        return (
                            <tr key={apoliceObj.id || Math.random().toString()}>
                                <td>{apoliceObj.numero_apolice || "N/A"}</td>
                                <td>{apoliceObj.produto || "N/A"}</td>
                                <td>{apoliceObj.administradora || "N/A"}</td>
                                <td>{apoliceObj.data_inicio ? new Date(apoliceObj.data_inicio).toLocaleDateString() : "N/A"}</td>
                                <td>{apoliceObj.forma_pagamento || "N/A"}</td>
                                <td>{apoliceObj.premio_pago ? `R$ ${apoliceObj.premio_pago}` : "N/A"}</td>
                                <td>
                                    <Button variant="primary">
                                        <FaInfoCircle />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(apoliceObj)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={7}>Nenhuma apólice encontrada.</td>
                    </tr>
                )}
                </tbody>
            </table>

            {apoliceToDelete && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    onConfirm={() => console.log("Excluir apólice", apoliceToDelete)}
                />
            )}
        </div>
    );
};

export default ApoliceTable;
