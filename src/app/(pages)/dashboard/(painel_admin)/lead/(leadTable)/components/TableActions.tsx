import React from "react";
import { Dropdown, Button, Tooltip } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { MenuProps } from "antd";
import { Cliente } from "@/types/interfaces";
import { ThunderboltOutlined } from "@ant-design/icons";

interface TableActionsProps {
    record: Cliente;
    setSelectedLead: (c: Cliente) => void;
    setIsEditModalOpen: (open: boolean) => void;
    setShowNegotiationWizard: (open: boolean) => void;
    handleDelete: (id: string) => void;
    foiVistoHoje: (id: string) => void;
    setInsightCliente: (c: Cliente) => void;           // <<< ADICIONE
    setInsightDrawerOpen: (v: boolean) => void;        // <<< ADICIONE
}

export const TableActions: React.FC<TableActionsProps> = ({
                                                              record,
                                                              setSelectedLead,
                                                              setIsEditModalOpen,
                                                              setShowNegotiationWizard,
                                                              handleDelete,
                                                              foiVistoHoje,
                                                              setInsightCliente,
                                                              setInsightDrawerOpen,
                                                          }) => {
    const items: MenuProps["items"] = [
        {
            key: "insight",
            label: (
                <Tooltip title="Pedir insight de venda personalizado">
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontWeight: 500,
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            setInsightCliente(record);
                            setInsightDrawerOpen(true);
                        }}
                    >
                        <ThunderboltOutlined style={{ color: "#FFB800", fontSize: 16 }} />
                        Insight da Cora
                    </span>
                </Tooltip>
            ),
        },
        {
            key: "edit",
            label: "✏️ Editar",
            onClick: () => {
                setSelectedLead(record);
                setIsEditModalOpen(true);
            },
        },
        {
            key: "negociar",
            label: "⚡ Negociação",
            onClick: () => {
                setSelectedLead(record);
                setShowNegotiationWizard(true);
            },
        },
        {
            key: "delete",
            label: "🗑️ Excluir",
            danger: true,
            onClick: () => handleDelete(record.id),
        },
    ];

    return (
        <Dropdown menu={{ items }} trigger={["hover"]}>
            <Button icon={<BsThreeDotsVertical />} />
        </Dropdown>
    );
};
