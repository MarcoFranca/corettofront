import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, message, Upload } from "antd";
import { DownloadOutlined, UploadOutlined, FileExcelOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import api from "@/app/api/axios";
import { useRouter } from "next/navigation";
import ClientePerfilDrawer from "@/app/(pages)/dashboard/(painel_admin)/carteira/ClientePerfilDrawer";
import { getClientesColumns } from "./ClientesColumns";
import { ClientesTableContainer } from './ClientesTable.styles';

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

    // Estado local para paginação
    const [clientes, setClientes] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
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

    // Busca clientes sempre que filtro/página mudar
    useEffect(() => {
        fetchClientes(page, pageSize);
        // eslint-disable-next-line
    }, [debouncedSearch, filterIsVip, JSON.stringify(filterStatus), page, pageSize]);

    // Função para buscar clientes com paginação
    const fetchClientes = async (currentPage = 1, limit = 20) => {
        setIsLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit,
                search: debouncedSearch || undefined,
            };
            if (filterIsVip === true) params.is_vip = true;
            if (filterStatus && filterStatus.length > 0) params.status = filterStatus;
            const response = await api.get('/clientes/carteira/', { params });
            setClientes(response.data.results);
            setTotal(response.data.count);
        } catch (e) {
            message.error("Erro ao carregar clientes.");
        }
        setIsLoading(false);
    };

    // Exportação/Importação (igual antes)
    const handleExport = async () => { /* ... */ };
    const handleDownloadTemplate = async () => { /* ... */ };
    const handleImport = async (file: File) => { /* ... */ };

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
            <ClientesTableContainer>
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
                    loading={isLoading}
                    pagination={{
                        current: page,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        onChange: (newPage, newPageSize) => {
                            setPage(newPage);
                            setPageSize(newPageSize);
                        },
                        showTotal: (total) => `Total de ${total} clientes`,
                    }}
                    bordered
                    size="middle"
                    scroll={{ x: "max-content", y: "75vh" }}
                    style={{ minWidth: "80%", background: "#fff" }}
                />
            </ClientesTableContainer>
            <ClientePerfilDrawer
                clienteId={selectedClienteId}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
}
