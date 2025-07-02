"use client";
import React, { useEffect, useState } from "react";
import {Table, Drawer, message, Tabs, Spin} from "antd";
import { ContainerCanva } from "./LeadTable.styles";
import ScheduleMeetingForm from "@/app/components/Modal/meeting/ScheduleMeetingForm";
import EditLeadModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/EditLead";
import NegociacoesModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/NegociacoesModal";
import NegotiationWizardModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/NegotiationWizardModal";
import IndicadoresNegociacoes from "@/app/components/strategy/IndicadoresNegociacoes";
import ClientePerfilDrawer from "@/app/components/cliente/ClientePerfilDrawer";
import ClienteInsightDrawer from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/ClienteInsightDrawer";
import { getLeadTableColumns } from "./components/columns";
import api from "@/app/api/axios";
import { useAppSelector } from "@/services/hooks/hooks";
import { useNegotiationSeen } from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/components/useLeadTable";
import { Cliente } from "@/types/interfaces";

interface LeadTableProps {
    reloadLeads?: boolean;
}

const LeadTable: React.FC<LeadTableProps> = ({ reloadLeads }) => {
    const usuarioId = String(useAppSelector(state => state.auth.user?.id ?? ""));

    // ==== ESTADOS PRINCIPAIS ====
    const [leads, setLeads] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tab, setTab] = useState("leads-puros");

    // ==== Modais/Drawers ====
    const [insightDrawerOpen, setInsightDrawerOpen] = useState(false);
    const [insightCliente, setInsightCliente] = useState<any>(null);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [negociacoesModalVisible, setNegociacoesModalVisible] = useState(false);
    const [negociacoesSelecionadas, setNegociacoesSelecionadas] = useState<any[]>([]);
    const [showNegotiationWizard, setShowNegotiationWizard] = useState(false);
    const [showClienteDrawer, setShowClienteDrawer] = useState(false);
    const [clienteDetalhado, setClienteDetalhado] = useState<Cliente | null>(null);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);

    // ==== Vistos (igual seu hook) ====
    const { negociacoesVistas, marcarComoVisto, foiVistoHoje } = useNegotiationSeen(usuarioId);

    const handleOpenNegotiationWizard = async (lead: Cliente) => {
        setShowNegotiationWizard(true);
        setClienteDetalhado(null);
        setLoadingDetalhe(true);
        try {
            const { data } = await api.get(`/clientes/${lead.id}/`);
            setClienteDetalhado(data);
        } catch (e) {
            message.error('Erro ao buscar detalhes do cliente.');
        }
        setLoadingDetalhe(false);
    };

    // Gere o filtro de indicação dinâmico antes de chamar getLeadTableColumns
    const filtroIndicacao = [
        { text: "Sem indicação", value: "sem_indicacao" },
        { text: "Cliente", value: "tipo:cliente" },
        { text: "Parceiro", value: "tipo:parceiro" },
        ...leads
            .map(l => {
                if (!l.indicado_por_detalhes) return null;
                const tipo = l.indicado_por_detalhes.tipo;
                const nome = l.indicado_por_detalhes.nome;
                return {
                    text: `${tipo === "cliente" ? "Cliente: " : "Parceiro: "}${nome}`,
                    value: `${tipo}:${nome}`,
                };
            })
            .filter((v): v is {text: string, value: string} => !!v)
            // Remove duplicados
            .filter((v, i, arr) => arr.findIndex(t => t.value === v.value) === i)
    ];

    // ==== COLUNAS ====
    const columns = getLeadTableColumns({
        setSelectedLead,
        setIsEditModalOpen,
        setShowNegotiationWizard,
        handleDelete: (id: string) => {
            setLeads((prev) => prev.filter((lead) => lead.id !== id));
            message.success("Lead excluído com sucesso!");
        },
        setNegociacoesSelecionadas,
        setNegociacoesModalVisible,
        setShowClienteDrawer,
        filtroIndicacao,
        negociacoesVistas,
        marcarComoVisto,
        foiVistoHoje,
        setInsightCliente,
        setInsightDrawerOpen,
        handleOpenNegotiationWizard,
    });

    // ==== Buscar leads negociáveis ao montar/ao mudar aba ====
    useEffect(() => {
        fetchLeads(tab);
    }, [tab]);

    // Core para trocar backend para endpoints dedicados no futuro!
    const fetchLeads = async (tabKey: string) => {
        setIsLoading(true);
        let endpoint = "/clientes/";
        switch (tabKey) {
            case "leads-puros":
                endpoint += "leads-puros/";
                break;
            case "negociacao":
                endpoint += "em-negociacao/";
                break;
            case "descartados":
                endpoint += "descartados/";
                break;
            // Aqui poderia adicionar outros (ex: "ativos", "inativos") se quiser expandir depois
            default:
                endpoint += "";
        }
        try {
            const response = await api.get(endpoint);
            setLeads(response.data.results || response.data);
            console.log(response);
        } catch (e) {
            message.error("Erro ao carregar leads.");
            setLeads([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLeads(tab);
    }, [tab, reloadLeads]);

    // ==== Tabs para navegação (mínimo de lógica, máximo de clareza) ====
    const tabItems = [
        {
            key: "leads-puros",
            label: <>Leads Puros</>,
            children: (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={leads}
                    loading={isLoading}
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ x: "max-content", y: 500 }}
                    style={{ minWidth: "80%", background: "#fff" }}
                />
            ),
        },
        {
            key: "negociacao",
            label: <>Em Negociação</>,
            children: (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={leads}
                    loading={isLoading}
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ x: "max-content", y: 500 }}
                    style={{ minWidth: "80%", background: "#fff" }}
                />
            ),
        },
        {
            key: "descartados",
            label: <>Descartados</>,
            children: (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={leads}
                    loading={isLoading}
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ x: "max-content", y: 500 }}
                    style={{ minWidth: "80%", background: "#fff" }}
                />
            ),
        }
    ];

    return (
        <>
            <ContainerCanva>
                <h2>📋 Gestão Completa de Negociações</h2>
                <IndicadoresNegociacoes />
                <Tabs
                    activeKey={tab}
                    onChange={setTab}
                    items={tabItems}
                    destroyInactiveTabPane
                />

                {/* SCHEDULE MODAL */}
                {selectedLead && showScheduleForm && (
                    <ScheduleMeetingForm
                        entityId={selectedLead.id}
                        entityName={selectedLead.nome}
                        entityType="lead"
                        onClose={() => setShowScheduleForm(false)}
                    />
                )}
                {/* EDIT MODAL */}
                {selectedLead && isEditModalOpen && (
                    <EditLeadModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        cliente={selectedLead}
                    />
                )}
            </ContainerCanva>
            {/* NEGOCIAÇÕES MODAL */}
            <NegociacoesModal
                visible={negociacoesModalVisible}
                onClose={() => setNegociacoesModalVisible(false)}
                negociacoes={negociacoesSelecionadas}
            />
            {/* DRAWER DE NEGOCIAÇÃO */}
            {selectedLead && showNegotiationWizard && (
                <Drawer
                    title={`Negociação com ${selectedLead?.nome}`}
                    placement="right"
                    width={900}
                    onClose={() => setShowNegotiationWizard(false)}
                    open={showNegotiationWizard}
                    destroyOnClose
                >
                    {loadingDetalhe ? (
                        <Spin size="large" style={{ marginTop: 32 }} />
                    ) : clienteDetalhado && (
                        <NegotiationWizardModal
                            isOpen={showNegotiationWizard}
                            onClose={() => setShowNegotiationWizard(false)}
                            cliente={clienteDetalhado}
                        />
                    )}
                </Drawer>
            )}
            {/* DRAWER PERFIL */}
            {selectedLead && (
                <ClientePerfilDrawer
                    cliente={selectedLead}
                    open={showClienteDrawer}
                    onClose={() => setShowClienteDrawer(false)}
                />
            )}
            {/* INSIGHT DRAWER */}
            <ClienteInsightDrawer
                open={insightDrawerOpen}
                onClose={() => setInsightDrawerOpen(false)}
                cliente={insightCliente}
            />
        </>
    );
};

export default LeadTable;
