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

const LeadTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const leads = useAppSelector((state) => state.leads.leads);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchLeads({ status: ["lead", "negociacao", "nova_negociacao"] }));
    }, [dispatch]);

    useEffect(() => {
        setFilteredLeads(leads);
    }, [leads]);

    const handleDelete = (id: string) => {
        dispatch(deleteLead(id));
    };

    const handleSave = () => {
        if (selectedLead) {
            dispatch(updateLead({ id: selectedLead.id, updatedLead: selectedLead }));
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
            title: "Pipeline",
            dataIndex: "pipeline_stage",
            key: "pipeline_stage",
            filters: [
                { text: "Leads de Entrada", value: "leads de entrada" },
                { text: "Negociando", value: "negociando" },
                { text: "Finalização", value: "finalização" },
                { text: "Pouco Interesse", value: "pouco interesse" },
            ],
            onFilter: (value: boolean | Key, record: Lead) => record.pipeline_stage === value,
        },
        {
            title: "Status Reunião",
            dataIndex: "status_reuniao",
            key: "status_reuniao",
            filters: [
                { text: "Reunião Marcada", value: "reuniao_marcada" },
                { text: "Marcar Reunião", value: "marcar_reuniao" },
                { text: "Retornar", value: "retornar" },
                { text: "Não Atendeu", value: "nao_atendeu" },
                { text: "Não Tem Interesse", value: "nao_tem_interesse" },
            ],
            onFilter: (value: boolean | Key, record: Lead) => record.status_reuniao === value,
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
                        <Button icon={<FaCalendarAlt />} />
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
                            value={selectedLead.pipeline_stage}
                            onChange={(value) => setSelectedLead(prev => prev ? ({ ...prev, pipeline_stage: value }) : null)}
                            options={[
                                { value: "leads de entrada", label: "Leads de Entrada" },
                                { value: "negociando", label: "Negociando" },
                                { value: "finalização", label: "Finalização" },
                                { value: "pouco interesse", label: "Pouco Interesse" },
                            ]}
                            style={{ marginBottom: 10, width: "100%" }}
                        />

                        <label>Status Reunião</label>
                        <Select
                            value={selectedLead.status_reuniao}
                            onChange={(value) => setSelectedLead(prev => prev ? ({ ...prev, status_reuniao: value }) : null)}
                            options={[
                                { value: "marcar_reuniao", label: "Marcar Reunião" },
                                { value: "reuniao_marcada", label: "Reunião Marcada" },
                                { value: "retornar", label: "Retornar" },
                                { value: "nao_atendeu", label: "Não Atendeu" },
                                { value: "nao_tem_interesse", label: "Não Tem Interesse" },
                            ]}
                            style={{ marginBottom: 10, width: "100%" }}
                        />

                        <label>Observações</label>
                        <Input.TextArea
                            rows={4}
                            value={selectedLead.observacoes || ""}
                            onChange={(e) => setSelectedLead(prev => prev ? ({ ...prev, observacoes: e.target.value }) : null)}
                        />
                    </>
                )}
            </Modal>
        </TableContainer>
    );
};

export default LeadTable;
