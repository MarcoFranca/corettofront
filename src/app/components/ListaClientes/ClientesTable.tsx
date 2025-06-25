'use client';
import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Input, Space, message, Upload } from "antd";
import { DownloadOutlined, UploadOutlined, FileExcelOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import api from "@/app/api/axios";
import { useRouter } from "next/navigation";
import ClientePerfilDrawer from "@/app/(pages)/dashboard/(painel_admin)/carteira/ClientePerfilDrawer";
import { getClientesColumns } from "./ClientesColumns";

// Utilitário para debounce do search
function useDebounce(value: string, delay = 600) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

export default function ClientesTable() {
    const router = useRouter();

    // Estado local para scroll infinito
    const [clientes, setClientes] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    // Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);

    // Filtros
    const [filterIsVip, setFilterIsVip] = useState<boolean | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<string[] | null>(null);

    // Processando (import/export)
    const [isProcessing, setIsProcessing] = useState(false);

    // Reseta lista ao trocar busca/filtros
    useEffect(() => {
        setClientes([]);
        setPage(1);
        setHasMore(true);
        fetchMoreClientes(1, true);
        // eslint-disable-next-line
    }, [debouncedSearch, filterIsVip, JSON.stringify(filterStatus)]);

    // Scroll infinito manual na .ant-table-body
    useEffect(() => {
        const tableBody = document.querySelector('.ant-table-body');
        if (!tableBody) return;

        const handleScroll = (e: any) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            // Quando chega próximo do fim, busca mais (ajuste o valor conforme quiser)
            if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading) {
                fetchMoreClientes();
            }
        };

        tableBody.addEventListener('scroll', handleScroll);
        return () => tableBody.removeEventListener('scroll', handleScroll);
        // Dependências garantem que novo evento é criado se lista muda
    }, [clientes, hasMore, isLoading]);

    // Buscar mais clientes (página atual, replace se é busca nova)
    const fetchMoreClientes = async (currentPage = page, replace = false) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit: 20,
                search: debouncedSearch || undefined,
            };
            if (filterIsVip === true) params.is_vip = true;
            if (filterStatus && filterStatus.length > 0) params.status = filterStatus;
            const response = await api.get('/clientes/carteira/', { params });
            const novosClientes = response.data.results;
            setClientes(prev => replace ? novosClientes : [...prev, ...novosClientes]);
            if (!response.data.next || novosClientes.length === 0) setHasMore(false);
            setPage(currentPage + 1);
        } catch (e) {
            message.error("Erro ao carregar clientes.");
            setHasMore(false);
        }
        setIsLoading(false);
    };

    // Exportação/Importação (igual antes)
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
            setClientes([]);
            setPage(1);
            setHasMore(true);
            fetchMoreClientes(1, true); // Recarrega tudo do zero!
        } catch {
            message.error("Erro ao importar clientes.");
        }
        setIsProcessing(false);
        return false;
    };

    // Menu de ações da tabela
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
            onClick: () => message.warning("Exclusão implementa pelo Redux, ajuste aqui se necessário!")
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

            <Table
                rowKey="id"
                columns={getClientesColumns({
                    actionMenu,
                    filterIsVip,
                    filterStatus,
                    setDrawerOpen,
                    setSelectedClienteId,
                })}
                dataSource={clientes}
                loading={isLoading && clientes.length === 0}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: "max-content", y: "75vh" }}
                style={{ minWidth: "80%", background: "#fff" }}
            />

            {(!hasMore && clientes.length > 0) && (
                <div style={{ textAlign: "center", padding: 16, color: "#aaa" }}>
                    Fim da lista!
                </div>
            )}

            <ClientePerfilDrawer
                clienteId={selectedClienteId}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
}
