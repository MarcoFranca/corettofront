// components/negociacao/NegociacaoReunioesTab.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import {fetchClientMeetings, fetchMeetingsByNegociacao} from '@/store/slices/meetingSlice';
import { Cliente, NegociacaoCliente} from '@/types/interfaces';
import { BsPlusCircle } from 'react-icons/bs';
import { Container, TopBar } from './NegociacaoReunioesTab.styles';
import ScheduleMeetingFormStyled from "@/app/components/Modal/meeting/ScheduleMeetingFormStyled";
import {Meeting} from "@/types/AgendaInterfaces";

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
    onReuniaoAtualizada: () => Promise<void>; // ✅ ADICIONE ESTA LINHA
}

function ScheduleMeetingModal(props: {
    cliente: Cliente,
    onClose: () => void,
    visible: boolean,
    negociacao: NegociacaoCliente,
    meeting: Meeting | null
}) {
    return null;
}

const NegociacaoReunioesTab: React.FC<Props> = ({ cliente, negociacao, onReuniaoAtualizada }) => {
    const dispatch = useAppDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

    const allMeetings = useAppSelector(state => state.meetings.meetings);
    const reunioes = allMeetings.filter((m: Meeting) => {
        if (typeof m.negociacao === 'string') {
            return m.negociacao === negociacao.id;
        } else if (typeof m.negociacao === 'object' && m.negociacao?.id) {
            return m.negociacao.id === negociacao.id;
        }
        return false;
    });

    useEffect(() => {
        if (negociacao?.id) {
            dispatch(fetchMeetingsByNegociacao(negociacao.id));
        }
    }, [negociacao.id, dispatch]);


    const columns = [
        {
            title: 'Data',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (start: string) =>
                new Date(start).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                }),
        },
        {
            title: '⚠️ Situação',
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
            render: (description: string) => <p>{description}</p>,
        },
        {
            title: 'Status',
            dataIndex: 'status_reuniao',
            key: 'status_reuniao',
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    agendada: 'blue',
                    confirmada: 'green',
                    cancelada: 'red',
                    remarcada: 'orange',
                    no_show: 'warning',
                    realizada: 'success',
                };
                return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
            },
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: unknown, record: Meeting) => (
                <Button size="small" onClick={() => {
                    setEditingMeeting(record);
                    setModalVisible(true);
                }}>
                    Editar
                </Button>
            ),
        },
    ];

    return (
        <Container>
            <TopBar>
                <h3>📅 Reuniões Vinculadas</h3>
                <Button
                    icon={<BsPlusCircle />}
                    type="primary"
                    onClick={() => {
                        setEditingMeeting(null);
                        setModalVisible(true);
                    }}
                >
                    Nova Reunião
                </Button>
            </TopBar>

            <Table
                columns={columns}
                dataSource={reunioes}
                rowKey={(r) => r.id}
                pagination={false}
            />

            {modalVisible && (
                <ScheduleMeetingFormStyled
                    onClose={() => setModalVisible(false)}
                    cliente={cliente}
                    negociacao={negociacao}
                    meeting={editingMeeting as Meeting | null}
                    onSaved={onReuniaoAtualizada}
                />
            )}

        </Container>
    );
};

export default NegociacaoReunioesTab;
