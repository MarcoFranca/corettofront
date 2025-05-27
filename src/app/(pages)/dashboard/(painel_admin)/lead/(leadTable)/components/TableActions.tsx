import React from "react";
import { Dropdown, Button } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { MenuProps } from "antd";
import { Cliente } from "@/types/interfaces";

interface TableActionsProps {
    record: Cliente;
    setSelectedLead: (c: Cliente) => void;
    setIsEditModalOpen: (open: boolean) => void;
    setShowNegotiationWizard: (open: boolean) => void;
    handleDelete: (id: string) => void;
    foiVistoHoje: (id: string) => void;
}

export const TableActions: React.FC<TableActionsProps> = ({
                                                              record,
                                                              setSelectedLead,
                                                              setIsEditModalOpen,
                                                              setShowNegotiationWizard,
                                                              handleDelete,
                                                              foiVistoHoje,
                                                          }) => {
    const items: MenuProps['items'] = [
        {
            key: 'edit',
            label: '✏️ Editar',
            onClick: () => {
                setSelectedLead(record);
                setIsEditModalOpen(true);
            }
        },
        {
            key: 'negociar',
            label: '⚡ Negociação',
            onClick: () => {
                setSelectedLead(record);
                setShowNegotiationWizard(true);
            }
        },
        {
            key: 'delete',
            label: '🗑️ Excluir',
            danger: true,
            onClick: () => handleDelete(record.id),
        }
    ];

    return (
        <Dropdown menu={{ items }} trigger={["hover"]}>
            <Button icon={<BsThreeDotsVertical />} />
        </Dropdown>
    );
};
