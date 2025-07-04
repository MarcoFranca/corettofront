import React from "react";
import { Dropdown, Button, Tooltip } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { MenuProps } from "antd";
import { Cliente } from "@/types/interfaces";
import { ThunderboltOutlined } from "@ant-design/icons";

interface TableActionsProps {
    record: Cliente;
    setSelectedLead: (c: Cliente) => void;
    setIsEditDrawerOpen: (open: boolean) => void;
    setShowNegotiationWizard: (open: boolean) => void;
    handleDelete: (id: string) => void;
    foiVistoHoje: (id: string) => void;
    setInsightCliente: (c: Cliente) => void;
    setInsightDrawerOpen: (v: boolean) => void;
    handleOpenNegotiationWizard: (lead: Cliente) => void;
    marcarComoVisto: (id: string) => void
}

export const TableActions: React.FC<TableActionsProps> = (
    {
        record,
        setSelectedLead,
        setIsEditDrawerOpen,
        handleDelete,
        setInsightCliente,
        setInsightDrawerOpen,
        handleOpenNegotiationWizard,
        marcarComoVisto,

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
                setIsEditDrawerOpen(true);
            },
        },
        {
            key: "negociar",
            label: "⚡ Negociação",
            onClick: () => {
                handleOpenNegotiationWizard(record);
                marcarComoVisto(record.id); // Pode marcar aqui sem problemas!
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
