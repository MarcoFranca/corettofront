"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Tooltip, Modal, Select, Input, Radio } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchLeads, deleteLead, updateLead } from "@/store/slices/leadsSlice";
import { Lead } from "@/types/interfaces";
import { TableContainer } from "./LeadTable.styles";
import { getWhatsAppLink } from "@/utils/functions";
import { FaCalendarAlt, FaEdit, FaTrash, FaWhatsapp } from "react-icons/fa";
import { formatPhoneNumber } from "@/utils/maskUtils";
import { Key } from 'react';
import ScheduleMeetingForm from "@/app/components/Modal/meeting/ScheduleMeetingForm";
import EditLeadModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/EditLead";

const LeadTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const leads = useAppSelector((state) => state.leads.leads);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchLeads({ status: ["lead", "negociacao", "nova_negociacao"] }));
    }, [dispatch]);

    useEffect(() => {
        setFilteredLeads(leads);
    }, [leads]);

    const handleDelete = (id: string) => {
        dispatch(deleteLead(id));
    };

    const STATUS_REUNIAO_MAP: Record<string, string> = {
        "reuniao_marcada": "Reunião Marcada",
        "retornar": "Retornar",
        "nao_tem_interesse": "Não Tem Interesse",
        "nao_atendeu": "Não Atendeu",
        "marcar_reuniao": "Marcar Reunião"
    };


    const handleScheduleFormClose = () => {
        setShowScheduleForm(false);

        if (selectedLead) {
            const updatedLead: Partial<Lead> = {
                status_reuniao: "reuniao_marcada" as Lead["status_reuniao"], // ✅ Apenas o campo necessário
            };

            // 🚀 Atualiza apenas o status da reunião
            dispatch(updateLead({ id: selectedLead.id, updatedLead }));

            // 🚀 Recarrega os leads para refletir a mudança
            dispatch(fetchLeads({ status: ["lead", "negociacao", "nova_negociacao"] }));
        }
    };


    const columns = [
        { title: "Nome", dataIndex: "nome", key: "nome" },
        { title: "E-mail", dataIndex: "email", key: "email" },
        {
            title: "Telefone",
            dataIndex: "telefone",
            key: "telefone",
            render: (telefone: string) => (
                <a href={getWhatsAppLink(telefone)} target="_blank" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <FaWhatsapp color="#25D366"/>{formatPhoneNumber(telefone)}
                </a>
            ),
        },
        {
            title: "Próxima Reunião",
            dataIndex: "proxima_reuniao",
            key: "proxima_reuniao",
            render: (data: string | null) =>
                data ? new Date(data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Nenhuma agendada",
        },
        {
            title: "Pipeline",
            dataIndex: "pipeline_stage",
            key: "pipeline_stage",
            filters: [
                { text: "Leads de Entrada", value: "leads de entrada" },
                { text: "Negociando", value: "negociando" },
                { text: "Finalização", value: "finalização" },
                { text: "Pouco Interesse", value: "pouco interesse" },
                { text: "Clientes Ativos", value: "clientes ativos" },
                { text: "Clientes Pesrdidos", value: "clientes perdidos" },
            ],
            onFilter: (value: boolean | Key, record: Lead) => record.pipeline_stage === value,
        },
        {
            title: "Status Reunião",
            dataIndex: "status_reuniao",
            key: "status_reuniao",
            filters: Object.entries(STATUS_REUNIAO_MAP).map(([value, text]) => ({ text, value })),
            onFilter: (value: boolean | Key, record: Lead) => record.status_reuniao === value,
            render: (status: string) => (
                <span>{STATUS_REUNIAO_MAP[status] || "Desconhecido"}</span> // ✅ Mostra rótulo correto
            ),
        },
        {
            title: "Observações",
            dataIndex: "observacoes",
            key: "observacoes",
            render: (obs: string) => (
                obs ? (
                    <Tooltip title={obs}>
                        <span>{obs.length > 50 ? `${obs.substring(0, 50)}...` : obs}</span>
                    </Tooltip>
                ) : "Nenhuma observação"
            ),
        },
        {
            title: "Indicação",
            dataIndex: "indicado_por_detalhes",
            key: "indicado_por_detalhes",
            render: (indicado_por_detalhes: any) => (
                indicado_por_detalhes
                    ? indicado_por_detalhes.tipo === "cliente"
                        ? <Tooltip title={indicado_por_detalhes.nome}>
                            <strong>Cliente:</strong> {indicado_por_detalhes.nome}
                        </Tooltip>
                        : <Tooltip title={indicado_por_detalhes.nome}>
                            <strong>Parceiro:</strong> {indicado_por_detalhes.nome}
                        </Tooltip>
                    : "Sem indicação"
            ),
        },
        {
            title: "Ações",
            key: "actions",
            render: (_: unknown, record: Lead) => (
                <div style={{ display: "flex", gap: 10 }}>
                    <Tooltip title="Editar">
                        <Button icon={<FaEdit />} onClick={() => { setSelectedLead(record); setIsEditModalOpen(true); }}/>
                    </Tooltip>
                    <Tooltip title="Criar Reunião">
                        <Button icon={<FaCalendarAlt />} onClick={() => { setSelectedLead(record); setShowScheduleForm(true); }} />
                    </Tooltip>
                    <Tooltip title="Excluir">
                        <Button icon={<FaTrash />} danger onClick={() => handleDelete(record.id)} />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <TableContainer>
            <h2>📋 Gestão Completa de Leads</h2>
            <Table
                dataSource={filteredLeads}
                columns={columns}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 10 }}
            />

            {selectedLead && showScheduleForm && (
                <ScheduleMeetingForm
                    entityId={selectedLead.id}
                    entityName={selectedLead.nome}
                    entityType="lead"
                    onClose={handleScheduleFormClose}
                />
            )}

            {selectedLead && isEditModalOpen && (
                <EditLeadModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    lead={selectedLead}
                />
            )}

        </TableContainer>
    );
};

export default LeadTable;
