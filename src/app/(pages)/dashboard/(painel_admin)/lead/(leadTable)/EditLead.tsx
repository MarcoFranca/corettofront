"use client";

import React, { useEffect, useState } from "react";
import { Modal, Select, Input, Radio } from "antd";
import { RadioChangeEvent } from "antd/es/radio";
import { Lead, StatusReuniao } from "@/types/interfaces";
import api from "@/app/api/axios";
import { useAppDispatch } from "@/services/hooks/hooks";
import { updateLead } from "@/store/slices/leadsSlice";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";
import { useForm, Controller } from "react-hook-form";
import {playSound} from "@/store/slices/soundSlice";

interface EditLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ isOpen, onClose, lead }) => {
    const dispatch = useAppDispatch();
    const [indicacaoTipo, setIndicacaoTipo] = useState<"cliente" | "parceiro" | "">("");
    const [clientes, setClientes] = useState<{ value: string; label: string }[]>([]);
    const [parceiros, setParceiros] = useState<{ value: string; label: string }[]>([]);
    const [editedLead, setEditedLead] = useState<Lead | null>(lead);

    useEffect(() => {
        if (isOpen && lead) {
            dispatch(playSound("openModal"));
            setEditedLead({
                ...lead,
                indicado_por_cliente_id: lead.indicado_por_detalhes?.tipo === "cliente"
                    ? lead.indicado_por_detalhes.id  // Apenas o ID, sem objeto { value, label }
                    : undefined
            });

            setIndicacaoTipo(lead.indicado_por_detalhes?.tipo || "");
            fetchClientes();
            fetchParceiros();
        }
    }, [isOpen, lead]);

    const fetchClientes = async () => {
        try {
            const response = await api.get("/clientes/");
            setClientes(response.data.map((c: any) => ({ value: c.id, label: c.nome })));
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
        }
    };

    const fetchParceiros = async () => {
        try {
            const response = await api.get("/parceiros/");
            setParceiros(response.data.map((p: any) => ({ value: p.id, label: p.nome })));
        } catch (error) {
            console.error("Erro ao buscar parceiros", error);
        }
    };

    const { control, setValue, getValues } = useForm<{
        indicado_por_cliente_id: { value: string; label: string } | null;
    }>({
        defaultValues: {
            indicado_por_cliente_id: null,
        },
    });


    const handleSave = () => {
        if (editedLead) {
            console.log("📌 Lead antes de atualizar:", editedLead);
            console.log("📌 Tipo de indicação:", indicacaoTipo);
            console.log("📌 indicado_por_cliente_id:", editedLead.indicado_por_cliente_id);

            const updatedLead: Partial<Lead> = {
                pipeline_stage: editedLead.pipeline_stage,
                observacoes: editedLead.observacoes,
                status_reuniao: editedLead.status_reuniao as StatusReuniao,
                ...(indicacaoTipo === "cliente" && editedLead.indicado_por_cliente_id
                    ? { indicado_por_cliente_id: editedLead.indicado_por_cliente_id as string }  // Garante que é um ID string
                    : {}),
                ...(indicacaoTipo === "parceiro" && editedLead.indicado_por_parceiros_ids
                    ? { indicado_por_parceiros_ids: editedLead.indicado_por_parceiros_ids }
                    : {}),
            };

            console.log("📤 Dados enviados ao backend:", updatedLead);

            dispatch(updateLead({ id: editedLead.id, updatedLead }));
            onClose();
        }
    };


    return (
        <Modal
            title="Editar Lead"
            open={isOpen}
            onOk={handleSave}
            onCancel={onClose}
            okText="Salvar"
            cancelText="Cancelar"
        >
            {editedLead && (
                <>
                    {/* Indicação */}
                    <label>Indicação</label>
                    <Radio.Group
                        value={indicacaoTipo}
                        onChange={(e: RadioChangeEvent) => setIndicacaoTipo(e.target.value)}
                        style={{ marginBottom: 10 }}
                    >
                        <Radio value="cliente">Cliente</Radio>
                        <Radio value="parceiro">Parceiro</Radio>
                    </Radio.Group>

                    {indicacaoTipo === "cliente" && (
                        <SelectCliente
                            label="Cliente"
                            name="indicado_por_cliente_id"
                            control={control}
                            placeholder="Selecione um cliente"
                            required
                            showLabel={false}
                            onChange={(selected) => {
                                setValue("indicado_por_cliente_id", selected);
                                setEditedLead(prev => prev ? ({ ...prev, indicado_por_cliente_id: selected?.value || "" }) : prev);
                            }}
                        />

                    )}

                    {indicacaoTipo === "parceiro" && (
                        <Select
                            mode="multiple" // 🔥 Permite múltiplos parceiros
                            value={editedLead?.indicado_por_parceiros_ids ?? []}  // ✅ Garante que é sempre um array
                            onChange={(value: string[]) =>
                                setEditedLead(prev => prev ? ({ ...prev, indicado_por_parceiros_ids: value }) : prev)
                            }
                            options={parceiros}
                            placeholder="Selecione um ou mais parceiros"
                            style={{ width: "100%", marginBottom: 10 }}
                        />
                    )}

                    {/* Pipeline */}
                    <label>Pipeline Stage</label>
                    <Select
                        value={editedLead?.pipeline_stage}
                        onChange={(value: string) =>
                            setEditedLead(prev => prev ? ({ ...prev, pipeline_stage: value }) : prev)
                        }
                        options={[
                            { value: "leads de entrada", label: "Leads de Entrada" },
                            { value: "negociando", label: "Negociando" },
                            { value: "finalização", label: "Finalização" },
                            { value: "pouco interesse", label: "Pouco Interesse" },
                            { value: "clientes ativos", label: "Clientes Ativos" },
                            { value: "clientes perdidos", label: "Clientes Perdidos" },
                        ]}
                        style={{ marginBottom: 10, width: "100%" }}
                    />

                    {/* Status da Reunião */}
                    <label>Status Reunião</label>
                    <Select
                        value={editedLead?.status_reuniao}
                        onChange={(value: StatusReuniao) =>
                            setEditedLead(prev => prev ? ({ ...prev, status_reuniao: value }) : prev)
                        }
                        options={[
                            { value: "reuniao_marcada", label: "Reunião Marcada" },
                            { value: "retornar", label: "Retornar" },
                            { value: "nao_tem_interesse", label: "Não Tem Interesse" },
                            { value: "nao_atendeu", label: "Não Atendeu" },
                            { value: "marcar_reuniao", label: "Marcar Reunião" },
                        ]}
                        style={{ marginBottom: 10, width: "100%" }}
                    />

                    {/* Observações */}
                    <label>Observações</label>
                    <Input.TextArea
                        rows={4}
                        value={editedLead?.observacoes || ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setEditedLead(prev => prev ? ({ ...prev, observacoes: e.target.value }) : prev)
                        }
                    />
                </>
            )}
        </Modal>
    );
};

export default EditLeadModal;
