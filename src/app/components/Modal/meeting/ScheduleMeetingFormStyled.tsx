// components/negociacao/ScheduleMeetingDrawer.tsx
'use client';

import React, { useState } from 'react';
import {
    Drawer,
    Form,
    Input,
    DatePicker,
    TimePicker,
    Checkbox,
    Button,
    Spin,
    message
} from 'antd';
import { useAppDispatch } from '@/services/hooks/hooks';
import { createAgendaItem } from '@/store/slices/agendaSlice';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import { Meeting } from '@/types/AgendaInterfaces';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { createAtividade } from '@/store/slices/negociacoesSlice';

interface Props {
    open: boolean;
    onClose: () => void;
    cliente: Cliente;
    negociacao?: NegociacaoCliente;
    modelo?: Partial<Meeting>;
    onSaved: () => void;
}

const ScheduleMeetingDrawer: React.FC<Props> = ({ open, onClose, cliente, negociacao, modelo = {}, onSaved }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const start = dayjs(`${values.date.format('YYYY-MM-DD')}T${values.startTime.format('HH:mm')}`).toISOString();
        const end = dayjs(`${values.date.format('YYYY-MM-DD')}T${values.endTime.format('HH:mm')}`).toISOString();

        const payload: Partial<Meeting> = {
            title: values.title,
            description: values.description,
            cliente: cliente.id,
            ...(negociacao && { negociacao: negociacao.id }),
            start_time: start,
            end_time: end,
            add_to_google_calendar: values.add_to_google_calendar,
            add_to_google_meet: values.add_to_google_meet,
            type: 'meeting',
            status_reuniao: 'agendada',
        };

        try {
            await dispatch(createAgendaItem(payload)).unwrap();

            // Só cria atividade se existir negociação!
            if (negociacao) {
                await dispatch(createAtividade({
                    cliente: cliente.id,
                    negociacao: negociacao.id,
                    descricao: `📅 Reunião agendada: ${values.title}`,
                    observacao: values.description,
                    tipo: 'reuniao',
                    data: start,
                }));
            }

            toast.success('Reunião criada com sucesso!');
            onSaved();
            onClose();
        } catch (err) {
            message.error('Erro ao salvar a reunião');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Drawer
            title="Nova Reunião"
            width={480}
            onClose={onClose}
            open={open}
            destroyOnClose
            extra={<Button onClick={onClose}>Cancelar</Button>}
        >
            <Spin spinning={loading} tip="Salvando...">
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    initialValues={{
                        title: modelo.title || '',
                        description: modelo.description || '',
                        date: modelo.start_time ? dayjs(modelo.start_time) : null,
                        startTime: modelo.start_time ? dayjs(modelo.start_time) : null,
                        endTime: modelo.end_time ? dayjs(modelo.end_time) : null,
                        add_to_google_calendar: modelo.add_to_google_calendar || false,
                        add_to_google_meet: modelo.add_to_google_meet || false,
                    }}
                >
                    <Form.Item name="title" label="Título" rules={[{ required: true, message: 'Informe um título' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Descrição">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="date" label="Data" rules={[{ required: true }]}>
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="startTime" label="Hora Início" rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="endTime" label="Hora Fim" rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="add_to_google_calendar" valuePropName="checked">
                        <Checkbox>Adicionar ao Google Calendar</Checkbox>
                    </Form.Item>

                    <Form.Item name="add_to_google_meet" valuePropName="checked">
                        <Checkbox>Adicionar link do Google Meet</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Agendar Reunião
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Drawer>
    );
};

export default ScheduleMeetingDrawer;
