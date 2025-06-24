"use client";
import React, { useEffect, useState } from "react";
import { Table, Drawer, message } from "antd";
import { ContainerCanva } from "./LeadTable.styles";
import InfiniteScroll from "react-infinite-scroll-component";
import ScheduleMeetingForm from "@/app/components/Modal/meeting/ScheduleMeetingForm";
import EditLeadModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/EditLead";
import NegociacoesModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/NegociacoesModal";
import NegotiationWizardModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/NegotiationWizardModal";
import IndicadoresNegociacoes from "@/app/components/strategy/IndicadoresNegociacoes";
import ClientePerfilDrawer from "@/app/components/cliente/ClientePerfilDrawer";
import ClienteInsightDrawer from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/ClienteInsightDrawer";
import { getLeadTableColumns } from "./components/columns";
import api from "@/app/api/axios";
import { useAppDispatch, useAppSelector } from "@/services/hooks/hooks";
import {
    useNegotiationSeen
} from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/components/useLeadTable";

const LIMIT = 10; // Quantos leads por página

const LeadTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const usuarioId = String(useAppSelector(state => state.auth.user?.id ?? "")); // Força string

    // ==== ESTADOS PRINCIPAIS (scroll infinito local) ====
    const [leads, setLeads] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // ==== Modais/Drawers (mantém igual seu fluxo) ====
    const [insightDrawerOpen, setInsightDrawerOpen] = useState(false);
    const [insightCliente, setInsightCliente] = useState<any>(null);

    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [negociacoesModalVisible, setNegociacoesModalVisible] = useState(false);
    const [negociacoesSelecionadas, setNegociacoesSelecionadas] = useState<any[]>([]);
    const [showNegotiationWizard, setShowNegotiationWizard] = useState(false);
    const [showClienteDrawer, setShowClienteDrawer] = useState(false);

    // ==== Vistos (igual seu hook) ====
    const { negociacoesVistas, marcarComoVisto, foiVistoHoje } = useNegotiationSeen(usuarioId);

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
        filtroIndicacao: [],
        negociacoesVistas,
        marcarComoVisto,
        foiVistoHoje,
        setInsightCliente,
        setInsightDrawerOpen,
    });

    useEffect(() => {
        const body = document.querySelector("#lead-table-infinite-scroll .ant-table-body");
        if (body) body.setAttribute("id", "scrollableTableBody");
    }, [leads]);


    // ==== Fetch inicial / reset ao montar ====
    useEffect(() => {
        setLeads([]); setPage(1); setHasMore(true);
        fetchMoreLeads(1, true);
    }, []);

    // ==== Função para buscar próxima página ====
    const fetchMoreLeads = async (currentPage = page, replace = false) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: LIMIT,
                status: ["lead", "negociacao", "nova_negociacao"],
            };
            const response = await api.get("/clientes/lista-negociacoes/", { params });
            const novosLeads = response.data.results;
            setLeads(prev => replace ? novosLeads : [...prev, ...novosLeads]);
            setHasMore(!!response.data.next && novosLeads.length > 0);
            setPage(currentPage + 1);
        } catch (e) {
            message.error("Erro ao carregar leads.");
            setHasMore(false);
        }
        setIsLoading(false);
    };

    // ==== Altura da tabela responsiva ====
    const [tableHeight, setTableHeight] = useState(430);
    useEffect(() => {
        const updateHeight = () => {
            const headerOffset = 430;
            setTableHeight(window.innerHeight - headerOffset);
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    // ==== Filtro de leads visíveis ====
    // Se quiser aplicar mais filtros, use aqui (hoje já vem só leads negociáveis do backend)
    const filteredLeads = leads;

    return (
        <>
            <ContainerCanva>
                <h2>📋 Gestão Completa de Leads</h2>
                <IndicadoresNegociacoes />
                <div>
                    <InfiniteScroll
                        dataLength={leads.length}
                        next={() => fetchMoreLeads(page)}
                        hasMore={hasMore}
                        loader={<div style={{ textAlign: "center", padding: 16 }}>Carregando...</div>}
                        endMessage={
                            <div style={{ textAlign: "center", padding: 16, color: "#aaa" }}>
                                Fim da lista!
                            </div>
                        }
                        scrollableTarget="scrollableTableBody"
                    >
                        <Table
                            id="lead-table-infinite-scroll"
                            rowKey="id"
                            columns={columns}
                            dataSource={leads}
                            loading={isLoading && leads.length === 0}
                            pagination={false}
                            bordered
                            size="middle"
                            scroll={{ x: "max-content", y: 500 }} // <-- ALTURA FIXA DO TABELA
                            style={{ minWidth: "80%", background: "#fff" }}
                        />

                    </InfiniteScroll>
                </div>
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
                    <NegotiationWizardModal
                        isOpen={showNegotiationWizard}
                        onClose={() => setShowNegotiationWizard(false)}
                        cliente={selectedLead}
                    />
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
