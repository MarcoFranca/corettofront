"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Tooltip, Modal, Select, Input } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchLeads, deleteLead, updateLead } from "@/store/slices/leadsSlice";
import { Lead } from "@/types/interfaces";
import { TableContainer } from "./LeadTable.styles";
import { getWhatsAppLink } from "@/utils/functions";
import { FaCalendarAlt, FaEdit, FaTrash, FaWhatsapp } from "react-icons/fa";
import { formatPhoneNumber } from "@/utils/maskUtils";
import { Key } from 'react';
import ScheduleMeetingForm from "@/app/components/Modal/meeting/ScheduleMeetingForm";

const LeadTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const leads = useAppSelector((state) => state.leads.leads);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showScheduleForm, setShowScheduleForm] = useState(false);

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



    const handleSave = () => {
        if (selectedLead) {
            const updatedLead: Partial<Lead> = {
                pipeline_stage: selectedLead.pipeline_stage,
                observacoes: selectedLead.observacoes,
                status_reuniao: selectedLead.status_reuniao,
            };

            dispatch(updateLead({ id: selectedLead.id, updatedLead }));
            setIsModalOpen(false);
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
            title: "Ações",
            key: "actions",
            render: (_: unknown, record: Lead) => (
                <div style={{ display: "flex", gap: 10 }}>
                    <Tooltip title="Editar">
                        <Button icon={<FaEdit />} onClick={() => { setSelectedLead(record); setIsModalOpen(true); }} />
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

            <Modal
                title="Editar Lead"
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => setIsModalOpen(false)}
                okText="Salvar"
                cancelText="Cancelar"
            >
                {selectedLead && (
                    <>
                        <label>Pipeline Stage</label>
                        <Select
                            value={selectedLead?.pipeline_stage}
                            onChange={(value) => setSelectedLead(prev => prev ? ({ ...prev, pipeline_stage: value }) : prev)}
                            options={[
                                { value: "leads de entrada", label: "Leads de Entrada" },
                                { value: "negociando", label: "Negociando" },
                                { value: "finalização", label: "Finalização" },
                                { value: "pouco interesse", label: "Pouco Interesse" },
                                { text: "Clientes Ativos", value: "clientes ativos" },
                                { text: "Clientes Perdidos", value: "clientes perdidos" },
                            ]}
                            style={{ marginBottom: 10, width: "100%" }}
                        />
                        <Select
                            value={selectedLead?.status_reuniao}
                            onChange={(value) => setSelectedLead(prev => prev ? ({ ...prev, status_reuniao: value }) : prev)}
                            options={[
                                { value: "reuniao_marcada", label: "Reunião Marcada" },
                                { value: "retornar", label: "Retornar" },
                                { value: "nao_tem_interesse", label: "Não Tem Interesse" },
                                { value: "nao_atendeu", label: "Não Atendeu" },
                                { value: "marcar_reuniao", label: "Marcar Reunião" },

                            ]}
                            style={{ marginBottom: 10, width: "100%" }}
                        />

                        <label>Observações</label>
                        <Input.TextArea
                            rows={4}
                            value={selectedLead?.observacoes || ""}
                            onChange={(e) => setSelectedLead(prev => prev ? ({ ...prev, observacoes: e.target.value }) : prev)}
                        />
                    </>
                )}
            </Modal>

        </TableContainer>
    );
};

export default LeadTable;
