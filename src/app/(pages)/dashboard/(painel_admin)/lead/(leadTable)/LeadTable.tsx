"use client";
import React from "react";
import { Table, Drawer } from "antd";
import { ContainerCanva } from "./LeadTable.styles";
import ScheduleMeetingForm from "@/app/components/Modal/meeting/ScheduleMeetingForm";
import EditLeadModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/EditLead";
import NegociacoesModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/NegociacoesModal";
import NegotiationWizardModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/NegotiationWizardModal";
import IndicadoresNegociacoes from "@/app/components/strategy/IndicadoresNegociacoes";
import ClientePerfilDrawer from "@/app/components/cliente/ClientePerfilDrawer";
import { useAppDispatch, useAppSelector } from "@/services/hooks/hooks";
import {
    useLeadTable,
    useNegotiationSeen
} from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/components/useLeadTable";

const LeadTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientes = useAppSelector((state) => state.clientes.clientes);
    const usuarioId = String(useAppSelector(state => state.auth.user?.id ?? "")); // Força string

    // Hooks para vistos
    const { negociacoesVistas, marcarComoVisto, foiVistoHoje } = useNegotiationSeen(usuarioId);

    // Hook principal da tabela
    const leadTable = useLeadTable({
        dispatch,
        clientes,
        negociacoesVistas,
        marcarComoVisto,
        foiVistoHoje,
    });

    return (
        <>
            <ContainerCanva>
                <h2>📋 Gestão Completa de Leads</h2>
                <IndicadoresNegociacoes />
                {leadTable.tableHeight > 100 && (
                    <Table
                        loading={clientes.length === 0}
                        dataSource={leadTable.filteredLeads}
                        columns={leadTable.columns}
                        rowKey={(record) => record.id}
                        pagination={false}
                        scroll={{ x: "max-content", y: leadTable.tableHeight || 430 }}
                    />
                )}
                {leadTable.selectedLead && leadTable.showScheduleForm && (
                    <ScheduleMeetingForm
                        entityId={leadTable.selectedLead.id}
                        entityName={leadTable.selectedLead.nome}
                        entityType="lead"
                        onClose={leadTable.handleScheduleFormClose}
                    />
                )}
                {leadTable.selectedLead && leadTable.isEditModalOpen && (
                    <EditLeadModal
                        isOpen={leadTable.isEditModalOpen}
                        onClose={() => leadTable.setIsEditModalOpen(false)}
                        cliente={leadTable.selectedLead}
                    />
                )}
            </ContainerCanva>
            <NegociacoesModal
                visible={leadTable.negociacoesModalVisible}
                onClose={() => leadTable.setNegociacoesModalVisible(false)}
                negociacoes={leadTable.negociacoesSelecionadas}
            />
            {leadTable.selectedLead && leadTable.showNegotiationWizard && (
                <Drawer
                    title={`Negociação com ${leadTable.selectedLead?.nome}`}
                    placement="right"
                    width={900}
                    onClose={() => leadTable.setShowNegotiationWizard(false)}
                    open={leadTable.showNegotiationWizard}
                    destroyOnClose
                >
                    <NegotiationWizardModal
                        isOpen={leadTable.showNegotiationWizard}
                        onClose={() => leadTable.setShowNegotiationWizard(false)}
                        cliente={leadTable.selectedLead}
                    />
                </Drawer>
            )}
            {leadTable.selectedLead && (
                <ClientePerfilDrawer
                    cliente={leadTable.selectedLead}
                    open={leadTable.showClienteDrawer}
                    onClose={() => leadTable.setShowClienteDrawer(false)}
                />
            )}
        </>
    );
};

export default LeadTable;
