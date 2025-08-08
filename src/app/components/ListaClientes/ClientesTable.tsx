import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, message, Upload, Drawer, Spin } from "antd";
import {
    DownloadOutlined,
    UploadOutlined,
    FileExcelOutlined,
    DeleteOutlined,
    UserOutlined,
    EditOutlined
} from "@ant-design/icons";
import api from "@/app/api/axios";
import { useRouter } from "next/navigation";
import ClientePerfilDrawer from "@/app/(pages)/dashboard/(painel_admin)/carteira/ClientePerfilDrawer";
import { getClientesColumns } from "./ClientesColumns";
import { ClientesTableContainer } from './ClientesTable.styles';
import NegotiationWizardModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/NegotiationWizardModal";
import qs from 'qs';
import {toast} from "react-toastify";

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

    // Estados principais
    const [clientes, setClientes] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    // Drawer lateral de perfil
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);

    // Wizard/modal de negociação
    const [negociacaoDrawerOpen, setNegociacaoDrawerOpen] = useState(false);
    const [clienteNegociacao, setClienteNegociacao] = useState<any>(null);
    const [loadingNegociacao, setLoadingNegociacao] = useState(false);

    // Filtros
    const [filterIsVip, setFilterIsVip] = useState<boolean | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<string[] | null>(null);

    // Processando (import/export)
    const [isProcessing, setIsProcessing] = useState(false);

    // Função para buscar clientes
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

            console.log("Fetch params:", params);

            const response = await api.get('/clientes/carteira/', {
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // USE 'repeat'
            });

            setClientes(response.data.results);
            setTotal(response.data.count);
        } catch (e) {
            message.error("Erro ao carregar clientes.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

// Atualiza clientes com base em página, tamanho, filtros e busca
    useEffect(() => {
        fetchClientes(page, pageSize);
    }, [page, pageSize, debouncedSearch, filterIsVip, JSON.stringify(filterStatus)]);


    // Handlers export/import
    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/clientes/modelo-importacao/', {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'modelo_importacao_clientes.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao baixar modelo de importação:', error);
        }
    };


    const handleExport = async () => {
        try {
            const response = await api.get('/clientes/exportar/', {
                responseType: 'blob', // Importante para baixar arquivos
                headers: {
                    'Accept': 'text/csv',
                },
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clientes.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar clientes:', error);
        }
    };


    const handleImport = async (file: File) => {
        if (!file) {
            toast.warn("Por favor, selecione um arquivo para importar.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/clientes/importar/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success("Importação concluída com sucesso!");
                fetchClientes(); // Atualiza a tabela
            } else {
                toast.error("Erro ao importar clientes. Verifique o arquivo e tente novamente.");
            }
        } catch (error) {
            console.error('Erro ao importar clientes:', error);
            toast.error("Erro ao importar clientes. Verifique se o arquivo está correto.");
        }
    };


    // Novo handler para negociação
    const handleOpenNegotiationWizard = async (cliente: any) => {
        setNegociacaoDrawerOpen(true);
        setClienteNegociacao(null);
        setLoadingNegociacao(true);
        try {
            const { data } = await api.get(`/clientes/${cliente.id}/`);
            setClienteNegociacao(data);
        } catch (e) {
            message.error('Erro ao buscar detalhes do cliente.');
        }
        setLoadingNegociacao(false);
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
            key: "iniciar_negociacao",
            label: "Negociação",
            icon: <EditOutlined />,
            onClick: () => handleOpenNegotiationWizard(record),
        },
        {
            key: "excluir",
            label: "Excluir",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => message.warning("Exclusão implementada pelo Redux, ajuste aqui se necessário!")
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
                        fetchClientes,
                        page,
                        pageSize,
                        debouncedSearch,
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
                    // ----------- AQUI: handler de filtro do Ant Design
                    onChange={(pagination, filters, sorter, extra) => {
                        // Atualiza filtros normalmente
                        console.log("Filters mudou:", filters);

                        // Filtros: VIP
                        if (Array.isArray(filters.is_vip) && filters.is_vip.length > 0) {
                            const vipValue = filters.is_vip[0];
                            if (vipValue === true || vipValue === "true" || vipValue === 1 || vipValue === "1") {
                                setFilterIsVip(true);
                            } else {
                                setFilterIsVip('all');
                            }
                        } else {
                            setFilterIsVip('all');
                        }

                        // Filtros: Status
                        if (Array.isArray(filters.status) && filters.status.length > 0) {
                            setFilterStatus(filters.status.map(String));
                        } else {
                            setFilterStatus(null);
                        }

                        // Só zera a página se os filtros mudarem, não a paginação
                        if (extra.action !== 'paginate') {
                            setPage(1);
                        }
                    }}

                />

            </ClientesTableContainer>
            <ClientePerfilDrawer
                clienteId={selectedClienteId}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            {/* Drawer para iniciar negociação */}
            <Drawer
                title={clienteNegociacao ? `Negociação: ${clienteNegociacao.nome}` : "Negociação"}
                placement="right"
                width={900}
                onClose={() => setNegociacaoDrawerOpen(false)}
                open={negociacaoDrawerOpen}
                destroyOnClose
            >
                {loadingNegociacao ? (
                    <Spin size="large" style={{ marginTop: 32 }} />
                ) : clienteNegociacao && (
                    <NegotiationWizardModal
                        isOpen={negociacaoDrawerOpen}
                        onClose={() => setNegociacaoDrawerOpen(false)}
                        cliente={clienteNegociacao}
                    />
                )}
            </Drawer>

        </div>
    );
}
