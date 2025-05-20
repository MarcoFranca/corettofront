'use client';
import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Input, Select, Space, Tag, message, Upload, Dropdown, Pagination } from "antd";
import { DownloadOutlined, UploadOutlined, FileExcelOutlined, MailOutlined, WhatsAppOutlined, DeleteOutlined, UserOutlined, MoreOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/services/hooks/hooks";
import { fetchClientes, deleteCliente } from "@/store/slices/clientesSlice";
import api from "@/app/api/axios";
import { STATUS_CHOICES } from "@/utils/statusOptions";
import InputMask from "react-input-mask-next";
import { getPhoneMask } from "@/utils/maskUtils";
import { useRouter } from "next/navigation";

// Utilitário para debounce do search (sem biblioteca)
function useDebounce(value: string, delay = 600) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

export default function ClientesTable() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Redux state
    const clientes = useAppSelector((state) => state.clientes.clientes);
    const totalClientes = useAppSelector((state) => state.clientes.totalClientes);
    const status = useAppSelector((state) => state.clientes.status);
    const error = useAppSelector((state) => state.clientes.error);

    // State para filtros e paginação
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [filter, setFilter] = useState<string | undefined>();
    const [search, setSearch] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    // Fetch dos clientes
    useEffect(() => {
        dispatch(fetchClientes({
            status: filter,
            page: pagination.current,
            limit: pagination.pageSize,
            search: debouncedSearch || undefined
        }));
    }, [dispatch, filter, pagination.current, pagination.pageSize, debouncedSearch]);

    // --- Ações ---
    const handleExport = async () => {
        setIsProcessing(true);
        try {
            const response = await api.get('/clientes/exportar/', {
                responseType: 'blob',
                headers: { 'Accept': 'text/csv' },
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clientes.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Exportação concluída!");
        } catch {
            message.error("Erro ao exportar clientes.");
        }
        setIsProcessing(false);
    };

    const handleDownloadTemplate = async () => {
        setIsProcessing(true);
        try {
            const response = await api.get('/clientes/modelo-importacao/', { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'modelo_importacao_clientes.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Modelo de importação baixado!");
        } catch {
            message.error("Erro ao baixar modelo de importação.");
        }
        setIsProcessing(false);
    };

    const handleImport = async (file: File) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post('/clientes/importar/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            message.success("Importação concluída!");
            dispatch(fetchClientes({ status: filter, page: pagination.current, limit: pagination.pageSize, search: debouncedSearch || undefined }));
        } catch {
            message.error("Erro ao importar clientes.");
        }
        setIsProcessing(false);
        return false;
    };

    // --- Menu de ações ---
    const actionMenu = (record: any) => [
        {
            key: "perfil",
            label: "Perfil",
            icon: <UserOutlined />,
            onClick: () => router.push(`/dashboard/cliente/${record.id}`)
        },
        {
            key: "excluir",
            label: "Excluir",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => dispatch(deleteCliente(record.id))
        }
    ];

    // --- Columns da tabela ---
    const columns = useMemo(() => [
        {
            title: "Nome",
            dataIndex: "nome",
            key: "nome",
            render: (text: string, record: any) => (
                <span style={{ fontWeight: 700, color: "#042a75", whiteSpace: "nowrap" }}>
                    {text}
                    <span style={{ fontWeight: 400, color: "#222", marginLeft: 4 }}>{record.sobre_nome}</span>
                </span>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email: string) => (
                <a href={`mailto:${email}`} style={{ color: "#1890ff", fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    <MailOutlined style={{ color: "#2196f3", marginRight: 5 }} />
                    {email}
                </a>
            ),
        },
        {
            title: "Telefone",
            dataIndex: "telefone",
            key: "telefone",
            render: (telefone: string, record: any) => (
                <div>
                    <a
                        href={`https://wa.me/+55${telefone}?text=${record.nome}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#25D366", fontWeight: 500, display: 'flex', alignItems: 'center', marginBottom: 2 }}
                    >
                        <WhatsAppOutlined style={{ marginRight: 5, color: "#25D366" }} />
                        <InputMask
                            mask={getPhoneMask(telefone)}
                            value={telefone}
                            readOnly
                            style={{ border: "none", background: "transparent", padding: 0, fontWeight: 500, color: "#333", width: 115 }}
                        />
                    </a>
                    {record.relacionamentos?.contatos_adicionais?.map((contato: any, i: number) => (
                        <a key={i}
                           href={`https://wa.me/+55${contato.valor}?text=${record.nome}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           style={{ color: "#25D366", fontWeight: 400, display: 'flex', alignItems: 'center', marginLeft: 22 }}
                        >
                            <WhatsAppOutlined style={{ marginRight: 5, color: "#25D366" }} />
                            <InputMask
                                mask={getPhoneMask(contato.valor)}
                                value={contato.valor}
                                readOnly
                                style={{ border: "none", background: "transparent", padding: 0, fontWeight: 400, color: "#555", width: 115 }}
                            />
                        </a>
                    ))}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center" as "center",
            render: (status: string) => (
                <Tag color={STATUS_CHOICES[status]?.color || 'blue'} style={{ minWidth: 90, display: "inline-block", textAlign: "center", fontWeight: 600 }}>
                    {STATUS_CHOICES[status]?.label || status}
                </Tag>
            ),
        },
        {
            title: "Apólices",
            dataIndex: "total_apolices",
            key: "total_apolices",
            align: "center" as "center",
            render: (total: number) =>
                total
                    ? <span style={{ color: "#042a75", fontWeight: 600 }}>{`📜 ${total} Apólices`}</span>
                    : <span style={{ color: "#ccc" }}>Sem apólices ativas</span>
        },
        {
            title: "Ações",
            key: "acoes",
            align: "center" as "center",
            render: (_: any, record: any) => (
                <Dropdown
                    menu={{
                        items: actionMenu(record),
                        onClick: ({ key }) => {
                            const item = actionMenu(record).find(i => i.key === key);
                            if (item?.onClick) item.onClick();
                        }
                    }}
                    trigger={["click"]}
                >
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
            ),
        }
    ], [router, dispatch]);

    // --- Filtros ---
    return (
        <div style={{ background: "#fff", borderRadius: 10, padding: 0 }}>
            <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
                <Input.Search
                    allowClear
                    placeholder="🔍 Buscar nome, e-mail ou telefone"
                    value={search}
                    onSearch={setSearch}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: 220 }}
                />
                <Select
                    value={filter}
                    onChange={value => { setFilter(value); setPagination(p => ({ ...p, current: 1 })); }}
                    allowClear
                    placeholder="Status"
                    style={{ width: 150 }}
                >
                    {Object.entries(STATUS_CHOICES).map(([value, { label }]) => (
                        <Select.Option key={value} value={value}>{label}</Select.Option>
                    ))}
                </Select>
                <Button icon={<DownloadOutlined />} onClick={handleExport} loading={isProcessing}>
                    Exportar CSV
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleDownloadTemplate} loading={isProcessing}>
                    Modelo Importação
                </Button>
                <Upload
                    accept=".xlsx,.csv"
                    customRequest={({ file }) => handleImport(file as File)}
                    showUploadList={false}
                    disabled={isProcessing}
                >
                    <Button icon={<UploadOutlined />} loading={isProcessing}>
                        Importar Clientes
                    </Button>
                </Upload>
            </Space>

            <div style={{
                overflow: 'hidden',
                borderRadius: 8,
                boxShadow: "0 2px 10px 0 #e6eef7"
            }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={clientes}
                    loading={status === "loading"}
                    scroll={{ y: "75vh" }}
                    pagination={false}
                    bordered
                    size="middle"
                    style={{ minWidth: "80%", background: "#fff" }}
                />
            </div>

            <div style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                zIndex: 10,
                borderTop: "1px solid #eee",
                padding: "12px 0 0 0"
            }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={totalClientes}
                        showSizeChanger
                        onChange={(page: number, pageSize?: number) => {
                            setPagination({ current: page, pageSize: pageSize || 10 });
                        }}
                        pageSizeOptions={['10', '20', '30', '50']}
                        style={{ margin: 0, padding: 0 }}
                    />
                </div>
            </div>
            {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        </div>
    );
}
