'use client';

import { useEffect, useState } from "react";
import api from "@/app/api/axios";
import { toastError, toastSuccess } from "@/utils/toastWithSound";
import { Input, Modal, Select, Spin } from "antd";
import { Textarea } from "@/app/components/Modal/meeting/ScheduleMeetingFormStyled.styles";
import { AtividadeNegociacao, NegociacaoCliente } from "@/types/interfaces";
import { FormContainer } from "./NovaAtividadeModal.styles";

interface Props {
    visible: boolean;
    negociacao: NegociacaoCliente;
    onClose: () => void;
    onSaved: (novaAtividade: AtividadeNegociacao) => void;
    atividade?: AtividadeNegociacao | null; // nova prop opcional para edição
}

const NovaAtividadeModal: React.FC<Props> = ({
                                                 visible,
                                                 negociacao,
                                                 onClose,
                                                 onSaved,
                                                 atividade
                                             }) => {
    const [titulo, setTitulo] = useState('');
    const [status, setStatus] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (atividade) {
            setTitulo(atividade.titulo || '');
            setStatus(atividade.status || '');
            setObservacoes(atividade.observacoes || '');
        } else {
            setTitulo('');
            setStatus('');
            setObservacoes('');
        }
    }, [atividade, visible]);

    const handleSave = async () => {
        if (!titulo || !status) {
            toastError("Título e status são obrigatórios.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                negociacao: negociacao.id,
                titulo,
                status,
                observacoes
            };

            const res = atividade
                ? await api.patch(`/atividades-negociacao/${atividade.id}/`, payload)
                : await api.post('/atividades-negociacao/', payload);

            toastSuccess(atividade ? "Atividade atualizada!" : "Atividade salva com sucesso!");
            onSaved(res.data);
            onClose();
        } catch {
            toastError("Erro ao salvar atividade.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={atividade ? "Editar Atividade" : "Nova Atividade"}
            open={visible}
            onOk={handleSave}
            onCancel={onClose}
            confirmLoading={loading}
        >
            {loading ? (
                <Spin />
            ) : (
                <FormContainer>
                    <Input
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título"
                        size="large"
                    />
                    <Select
                        value={status}
                        onChange={setStatus}
                        placeholder="Selecione o status"
                        options={[
                            { label: "Contato realizado", value: "contato_realizado" },
                            { label: "Tentativa de contato", value: "tentativa" },
                            { label: "Não atendeu", value: "nao_atendeu" },
                            { label: "Solicitou retorno posterior", value: "retornar_posterior" },
                            { label: "Reunião agendada", value: "reuniao_agendada" },
                        ]}
                        size="large"
                    />
                    <Textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Observações (opcional)"
                        rows={4}
                    />
                </FormContainer>
            )}
        </Modal>
    );
};

export default NovaAtividadeModal;
