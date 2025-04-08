// components/negociacao/NegociacaoReunioesTab.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {Button, DatePicker, Dropdown, Form, MenuProps, Modal, Select, Table, Tag, Timeline} from 'antd';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import { fetchMeetingsByNegociacao} from '@/store/slices/meetingSlice';
import { Cliente, NegociacaoCliente} from '@/types/interfaces';
import { BsPlusCircle } from 'react-icons/bs';
import {Buttons, Container, TopBar} from './NegociacaoReunioesTab.styles';
import {Meeting} from "@/types/AgendaInterfaces";
import {
    DownOutlined
} from "@ant-design/icons";
import {toastError, toastSuccess} from "@/utils/toastWithSound";
import api from "@/app/api/axios";
import {
    criarReuniaoComModelo,
    statusMap
} from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/helpers/functions";
import ScheduleMeetingDrawer from "@/app/components/Modal/meeting/ScheduleMeetingFormStyled";

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
    onReuniaoAtualizada: () => Promise<void>; // ✅ ADICIONE ESTA LINHA
}

const NegociacaoReunioesTab: React.FC<Props> = ({ cliente, negociacao, onReuniaoAtualizada }) => {
    const dispatch = useAppDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [remarcarModalVisible, setRemarcarModalVisible] = useState(false);
    const [novaData, setNovaData] = useState<string | null>(null);
    const [reuniaoSelecionada, setReuniaoSelecionada] = useState<Meeting | null>(null);
    const [filtroStatus, setFiltroStatus] = useState<string | null>(null);

    const allMeetings = useAppSelector(state => state.meetings.meetings);
    const reunioes = allMeetings.filter((m: Meeting) => {
        if (typeof m.negociacao === 'string') {
            return m.negociacao === negociacao.id;
        } else if (typeof m.negociacao === 'object' && m.negociacao?.id) {
            return m.negociacao.id === negociacao.id;
        }
        return false;
    });

    const showRemarcarModal = (meeting: Meeting) => {
        setReuniaoSelecionada(meeting);
        setRemarcarModalVisible(true);
    };

    const handleConfirmarRemarcacao = async () => {
        if (!novaData || !reuniaoSelecionada) return;
        await atualizarReuniao(reuniaoSelecionada.id, 'remarcada', undefined, novaData);
        setRemarcarModalVisible(false);
        setNovaData(null);
    };

    useEffect(() => {
        if (negociacao?.id) {
            dispatch(fetchMeetingsByNegociacao(negociacao.id));
        }
    }, [negociacao.id, dispatch]);

    const atualizarReuniao = async (id: string, status: string, motivo?: string, novaData?: string) => {
        try {
            let start_time, end_time;

            if (novaData) {
                const start = new Date(novaData);
                const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h de duração padrão

                start_time = start.toISOString();
                end_time = end.toISOString();
            }

            await api.patch(`/agenda/${id}/`, {
                status_reuniao: status,
                motivo_cancelamento: motivo,
                ...(start_time && { start_time }),
                ...(end_time && { end_time }),
            });

            toastSuccess("Reunião atualizada!");
            dispatch(fetchMeetingsByNegociacao(negociacao.id));
        } catch {
            toastError("Erro ao atualizar reunião!");
        }
    };


    const reunioesFiltradas = filtroStatus
        ? reunioes.filter((r) => r.status_reuniao === filtroStatus)
        : reunioes;


    const columns = [
        {
            title: 'Data',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (start: string) => new Date(start).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        },
        {
            title: 'Situação',
            key: 'alerta',
            render: (_: unknown, record: Meeting) => {
                const passou = new Date(record.start_time) < new Date();
                if (passou && record.status_reuniao === 'agendada') {
                    return <Tag color="gold">Revisar status</Tag>;
                }
                return null;
            },
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status_reuniao',
            key: 'status_reuniao',
            render: (status: string) => {
                const data = statusMap[status];
                return (
                    <Tag color={data?.color || 'default'} icon={data?.icon}>
                        {data?.label || status}
                    </Tag>
                );
            }
        },
        {
            title: 'Histórico',
            key: 'historico',
            render: (_: unknown, record: Meeting) => (
                <Button
                    type="link"
                    onClick={() => {
                        Modal.info({
                            title: 'Histórico de Remarcações',
                            content: (
                                record.historico_remarcacoes ? (
                                    <Timeline>
                                        {record.historico_remarcacoes.split('\n').map((item, index) => (
                                            <Timeline.Item key={index}>{item}</Timeline.Item>
                                        ))}
                                    </Timeline>
                                ) : (
                                    <p>Sem histórico registrado.</p>
                                )
                            ),
                        });
                    }}
                >
                    Ver Histórico
                </Button>

            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: unknown, record: Meeting) => {
                const items: MenuProps['items'] = [
                    { label: 'Confirmar', key: 'confirmada' },
                    { label: 'Marcar como realizada', key: 'realizada' },
                    { label: 'No-show', key: 'no_show' },
                    { label: 'Cancelar', key: 'cancelada' },
                    { label: 'Remarcar', key: 'remarcada' },
                    { label: '📤 Exportar para Google Calendar', key: 'exportar' },

                ];

                const handleMenuClick = async ({ key }: { key: string }) => {
                    if (key === 'exportar') {
                        try {
                            if (!record.start_time || !record.end_time) {
                                toastError("Essa reunião não possui horário definido e não pode ser exportada.");
                                return;
                            }

                            await api.patch(`/agenda/${record.id}/`, {
                                add_to_google_calendar: true,
                                start_time: record.start_time, // ⬅️ obrigatório
                                end_time: record.end_time,     // ⬅️ obrigatório
                            });
                            toastSuccess("Reunião enviada para o Google Calendar com sucesso!");
                            dispatch(fetchMeetingsByNegociacao(negociacao.id));
                        } catch {
                            toastError("Erro ao exportar para o Google Calendar.");
                        }
                        return;
                    }

                    if (key === 'cancelada') {
                        const motivo = prompt("Informe o motivo do cancelamento:");
                        if (!motivo) {
                            toastError("Cancelamento exige motivo!");
                            return;
                        }
                        await atualizarReuniao(record.id, key, motivo);
                    } else if (key === 'remarcada') {
                        showRemarcarModal(record);
                    } else {
                        await atualizarReuniao(record.id, key);
                    }
                };

                return (
                    <Dropdown menu={{ items, onClick: handleMenuClick }}>
                        <Button>
                            Ações <DownOutlined />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ]

    return (
        <Container>
            <TopBar>
                <h3>📅 Reuniões Vinculadas</h3>
                <Buttons>

                <Select
                    allowClear
                    placeholder="Filtrar por status"
                    value={filtroStatus}
                    onChange={setFiltroStatus}
                    options={Object.entries(statusMap).map(([value, { label }]) => ({
                        value,
                        label,
                    }))}
                    style={{ width: 200, marginLeft: 'auto' }}
                />

                <Dropdown.Button
                    type="primary"
                    icon={<BsPlusCircle />}
                    menu={{
                        items: [
                            { label: '📊 Apresentação de Proposta',
                                key: 'apresentacao',
                                onClick: () => criarReuniaoComModelo('apresentacao', cliente, negociacao, setEditingMeeting, setModalVisible),
                            },
                            { label: '🔍 Revisão de Apólice',
                                key: 'revisao',
                                onClick: () => criarReuniaoComModelo('revisao', cliente, negociacao, setEditingMeeting, setModalVisible),
                            },
                            { label: '🖋️ Reunião Presencial',
                                key: 'presencial',
                                onClick: () => criarReuniaoComModelo('presencial', cliente, negociacao, setEditingMeeting, setModalVisible),
                            },
                            { label: '🤝 Fechamento de Negócio',
                                key: 'fechamento',
                                onClick: () => criarReuniaoComModelo('fechamento', cliente, negociacao, setEditingMeeting, setModalVisible),
                            },
                        ],
                    }}

                    onClick={() => {
                        setEditingMeeting(null);
                        setModalVisible(true);
                    }}
                >
                    Nova Reunião
                </Dropdown.Button>
                </Buttons>

            </TopBar>

            <Table
                columns={columns}
                dataSource={reunioesFiltradas}
                rowKey={(r) => r.id}
                pagination={false}
            />
            <Modal
                title="Remarcar Reunião"
                open={remarcarModalVisible}
                onCancel={() => setRemarcarModalVisible(false)}
                onOk={handleConfirmarRemarcacao}
                okText="Remarcar"
                cancelText="Cancelar"
            >
                <Form layout="vertical">
                    <Form.Item label="Nova Data e Hora">
                        <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="DD/MM/YYYY HH:mm"
                            onChange={(value) => setNovaData(value?.toISOString() || null)}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {modalVisible && (
                <ScheduleMeetingDrawer
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                    cliente={cliente}
                    negociacao={negociacao}
                    modelo={editingMeeting || undefined}
                    onSaved={onReuniaoAtualizada}
                />
            )}

        </Container>
    );
};

export default NegociacaoReunioesTab;
