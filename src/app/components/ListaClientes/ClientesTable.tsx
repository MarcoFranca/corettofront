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
import ClientePerfilDrawer from "@/app/(pages)/dashboard/(painel_admin)/carteira/ClientePerfilDrawer";
import { Cliente } from "@/types/interfaces";
import { getClientesColumns } from "./ClientesColumns";

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
    const [search, setSearch] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);

    // Filtros individuais
    const [filterIsVip, setFilterIsVip] = useState<boolean | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<string[] | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    // Fetch dos clientes - status como string ou undefined, is_vip como boolean ou undefined
    useEffect(() => {
        dispatch(fetchClientes({
            is_vip: filterIsVip === true ? true : undefined,
            status: filterStatus && filterStatus.length > 0 ? filterStatus : undefined, // <--- AQUI
            page: pagination.current,
            limit: pagination.pageSize,
            search: debouncedSearch || undefined,
        }));
    }, [dispatch, filterIsVip, filterStatus, pagination.current, pagination.pageSize, debouncedSearch]);


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
            dispatch(fetchClientes({
                is_vip: filterIsVip === true ? true : undefined,
                status: filterStatus && filterStatus.length > 0 ? filterStatus[0] : undefined,
                page: pagination.current,
                limit: pagination.pageSize,
                search: debouncedSearch || undefined
            }));
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
                    columns={getClientesColumns({
                        actionMenu,
                        filterIsVip,
                        filterStatus,
                        dispatch,
                        fetchClientes,
                        debouncedSearch,
                        pagination,
                        setDrawerOpen,
                        setSelectedClienteId,
                    })}
                    dataSource={clientes}
                    loading={status === "loading"}
                    scroll={{ y: "75vh" }}
                    pagination={false}
                    bordered
                    size="middle"
                    style={{ minWidth: "80%", background: "#fff" }}
                    onChange={(pagination, filters) => {
                        const vipFilter = filters.is_vip as boolean[] | undefined;
                        const statusFilter = filters.status as string[] | undefined;

                        setPagination({
                            current: pagination.current || 1,
                            pageSize: pagination.pageSize || 10
                        });

                        setFilterIsVip(vipFilter?.[0] ?? 'all');
                        setFilterStatus(statusFilter ?? null);

                        // 🔥 Dispara a busca já com o filtro correto!
                        dispatch(fetchClientes({
                            is_vip: vipFilter?.[0] === true ? true : undefined,
                            status: statusFilter && statusFilter.length > 0 ? statusFilter : undefined,
                            page: pagination.current || 1,
                            limit: pagination.pageSize || 10,
                            search: debouncedSearch || undefined,
                        }));
                    }}

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
            <ClientePerfilDrawer
                clienteId={selectedClienteId}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
}
