'use client';

import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { useAppDispatch } from '@/services/hooks/hooks';
import { createNegotiation } from '@/store/slices/negociacoesSlice';
import {Cliente} from '@/types/interfaces';
import {
    StyledModal,
    StyledForm,
    StyledFormItem,
    StyledSelect,
    StyledTextArea
} from './NovaNegociacaoModal.styles';
import {fetchClienteById} from "@/store/slices/clientesSlice";
import {toastError, toastSuccess} from "@/utils/toastWithSound";

interface Props {
    visible: boolean;
    onClose: () => void;
    cliente: Cliente;
    onCreated: (negociacaoId: string) => void;
}

const NovaNegociacaoModal: React.FC<Props> = ({ visible, onClose, cliente, onCreated }) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const result = await dispatch(
                createNegotiation({
                    ...values,
                    cliente: cliente.id,
                    encerrada: false,
                    status: 'marcar_reuniao',
                })
            ).unwrap();

            toastSuccess('Negociação criada com sucesso!');
            onCreated(result.id);
            form.resetFields();
            await dispatch(fetchClienteById(cliente.id));
            onClose();
        } catch (error) {
            toastError('Erro ao criar negociação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            open={visible}
            title="➕ Nova Negociação"
            onCancel={onClose}
            onOk={handleCreate}
            okText="Criar"
            confirmLoading={loading}
            centered
            destroyOnClose
        >
            <StyledForm layout="vertical" form={form}>
                <StyledFormItem
                    label="Título"
                    name="titulo"
                    rules={[{ required: true, message: 'Informe o título da negociação' }]}
                >
                    <Input placeholder="Ex: Segunda abordagem para seguro de vida" />
                </StyledFormItem>

                <StyledFormItem label="Observações" name="observacoes">
                    <StyledTextArea placeholder="Notas iniciais..." rows={4} />
                </StyledFormItem>

                <StyledFormItem
                    label="Interesse"
                    name="interesse"
                    initialValue="morno"
                    rules={[{ required: true, message: 'Selecione o interesse' }]}
                >
                    <StyledSelect
                        options={[
                            { label: '🔥 Quente', value: 'quente' },
                            { label: '🟠 Morno', value: 'morno' },
                            { label: '🧊 Frio', value: 'frio' },
                        ]}
                    />
                </StyledFormItem>
            </StyledForm>
        </StyledModal>
    );
};

export default NovaNegociacaoModal;
