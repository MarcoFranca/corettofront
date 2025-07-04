import React from "react";
import {Button, Dropdown, Tooltip, Tag, message} from "antd";
import { MailOutlined, WhatsAppOutlined, MoreOutlined, StarFilled, StarOutlined, EditOutlined } from "@ant-design/icons";
import { STATUS_CHOICES } from "@/utils/statusOptions";
import {formatPhoneNumber, removeMask} from "@/utils/maskUtils";
import type { Cliente } from "@/types/interfaces";
import api from "@/app/api/axios";

export function getClientesColumns({
                                       actionMenu,
                                       filterIsVip,
                                       filterStatus,
                                       dispatch,
                                       fetchClientes,
                                       debouncedSearch,
                                       pagination,
                                       setDrawerOpen,
                                       setSelectedClienteId,
                                   }: any) {
    return [
        // Estrela/Favorito (com filtro)
        {
            title: "⭐",
            dataIndex: "is_vip",
            key: "is_vip",
            width: 55,
            align: "center" as const,
            filters: [{ text: "Favoritos", value: true }],
            filteredValue: filterIsVip === true ? [true] : null,
            onFilter: (value: any, record: Cliente) =>
                record.is_vip === (value === true || value === "true" || value === 1 || value === "1"),
            render: (_: any, record: Cliente) => (
                <Tooltip title={record.is_vip ? "Remover dos favoritos" : "Marcar como favorito"}>
        <span
            style={{
                cursor: "pointer",
                fontSize: 22,
                color: record.is_vip ? "#FFD700" : "#ccc",
                display: "inline-block",
            }}
            onClick={async (e) => {
                e.stopPropagation(); // Para não abrir o Drawer sem querer
                try {
                    await api.patch(`/clientes/${record.id}/`, { is_vip: !record.is_vip });
                    dispatch(fetchClientes({
                        is_vip: filterIsVip === true ? true : undefined,
                        status: filterStatus && filterStatus.length > 0 ? filterStatus : undefined,
                        page: pagination.current,
                        limit: pagination.pageSize,
                        search: debouncedSearch || undefined,
                    }));
                    message.success(!record.is_vip ? "Adicionado aos favoritos!" : "Removido dos favoritos!");
                } catch {
                    message.error("Erro ao atualizar favorito.");
                }
            }}
        >
            {record.is_vip ? <StarFilled /> : <StarOutlined />}
        </span>
                </Tooltip>
            ),
        },
        {
            title: "Ações",
            key: "acoes",
            align: "center" as const,
            width: 80, // um pouquinho maior pra não cortar sombra/borda
            render: (_: any, record: Cliente) => (
                <Dropdown
                    menu={{
                        items: actionMenu(record),
                        onClick: ({ key }) => {
                            const item = actionMenu(record).find((i: any) => i.key === key);
                            if (item?.onClick) item.onClick();
                        }
                    }}
                    trigger={["click"]}
                >
                    <Button
                        icon={<MoreOutlined />}
                        size="small"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                        }}
                    />
                </Dropdown>
            ),
        },
        {
            title: "Nome Completo",
            dataIndex: "nome",
            key: "nome",
            maxWidth: 250,
            ellipsis: true,
            render: (_: any, record: Cliente) => {
                const nomeCompleto = `${record.nome ?? ""} ${record.sobre_nome ?? ""}`.trim();
                return (
                    <Tooltip title={nomeCompleto || "Sem cadastro"}>
                        <span
                            style={{
                                color: "#0450b4",
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "inline-block",
                                width: "100%",
                            }}
                            onClick={() => {
                                setDrawerOpen(true);
                                setSelectedClienteId(record.id);
                            }}
                        >
                            {nomeCompleto || <span style={{ color: "#bbb" }}>Sem cadastro</span>}
                        </span>
                    </Tooltip>
                );
            }
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            render: (email: string) =>
                email && email !== "NaN" && email !== "nan" ? (
                    <Tooltip title={email}>
                        <span style={{
                            color: "#2196f3",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "inline-block",
                            width: "100%",
                        }}>
                            <MailOutlined style={{ marginRight: 5 }} />{email}
                        </span>
                    </Tooltip>
                ) : <span style={{ color: "#bbb" }}>Sem cadastro</span>
        },

        {
            title: "Telefone",
            dataIndex: "telefone",
            key: "telefone",
            ellipsis: true,
            render: (telefone: string, record: Cliente) =>
                telefone && telefone !== "NaN" && telefone !== "nan" ? (
                    <Tooltip title={formatPhoneNumber(telefone)}>
                        <a
                            href={`https://wa.me/+55${removeMask(telefone)}?text=${record.nome}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#25D366",
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <WhatsAppOutlined style={{ marginRight: 5 }} />
                            <span
                                style={{
                                    fontWeight: 500,
                                    color: "#333",
                                    letterSpacing: 1,
                                }}
                            >
                        {formatPhoneNumber(telefone)}
                    </span>
                        </a>
                    </Tooltip>
                ) : (
                    <span style={{ color: "#bbb" }}>Sem cadastro</span>
                ),
        },
        {
            title: "Observações",
            dataIndex: "observacoes",
            key: "observacoes",
            ellipsis: true,
            render: (text: string) => (
                <span
                    style={{
                        color: text ? "#222" : "#bbb",
                        fontWeight: text ? 500 : 400,
                        display: "flex",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        position: "relative",
                        width: "100%",
                    }}
                    title={text || "Sem observação"}
                >
                    {text || "Sem observação"}
                    <EditOutlined style={{ marginLeft: 6, color: "#bbb", fontSize: 15, cursor: "pointer" }} />
                </span>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 150,
            filters: Object.entries(STATUS_CHOICES).map(([value, { label }]) => ({
                text: label,
                value,
            })),
            filteredValue: filterStatus,
            align: "center" as const,
            render: (status: string) => (
                <Tag color={STATUS_CHOICES[status]?.color || "blue"}>
                    {STATUS_CHOICES[status]?.label || status}
                </Tag>
            ),
        },
        {
            title: "Apólices",
            dataIndex: "total_apolices",
            key: "total_apolices",
            width: 120,
            align: "center" as const,
            render: (total: number) =>
                total
                    ? <span style={{ color: "#042a75", fontWeight: 600 }}>{`📜 ${total} Apólices`}</span>
                    : <span style={{ color: "#ccc" }}>Sem apólices ativas</span>
        },
    ];
}
