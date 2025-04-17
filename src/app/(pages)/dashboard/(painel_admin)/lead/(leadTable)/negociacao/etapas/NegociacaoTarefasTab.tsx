'use client';

import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form, Input, MenuProps, Table, Tag } from 'antd';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import { BsPlusCircle } from 'react-icons/bs';
import { ThunderboltOutlined } from '@ant-design/icons';
import { toastError, toastSuccess } from '@/utils/toastWithSound';
import api from '@/app/api/axios';
import NovaTarefaNegociacaoModal from '../modal/NovaTarefaNegociacaoModal';
import {
    Container, TableContainer, TopBar
} from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoTarefasTab.styles";

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
}

const NegociacaoTarefasTab: React.FC<Props> = ({ cliente, negociacao }) => {
    const [tarefas, setTarefas] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState<string>('');

    const carregarTarefas = () => {
        api.get(`/agenda/?negociacao=${negociacao.id}`)
            .then(res => setTarefas(res.data))
            .catch(() => toastError("Erro ao carregar tarefas da negociação."));
    };

    useEffect(() => {
        carregarTarefas();
    }, [negociacao.id]);

    const handleSalvarTitulo = async (id: string) => {
        try {
            await api.patch(`/agenda/${id}/`, { title: editingTitle });
            toastSuccess('Título atualizado!');
            carregarTarefas();
        } catch {
            toastError('Erro ao atualizar título.');
        }
        setEditingId(null);
    };

    const concluirTarefa = async (id: string) => {
        try {
            await api.patch(`/agenda/${id}/`, { completed: true });
            toastSuccess('Tarefa concluída!');
            carregarTarefas();
        } catch {
            toastError('Erro ao concluir tarefa.');
        }
    };

    const columns = [
        {
            title: 'Ações',
            key: 'actions',
            width: 90,
            render: (_: any, record: any) => {
                const items: MenuProps['items'] = [
                    { label: 'Concluir', key: 'concluir' },
                ];

                const handleMenuClick = async ({ key }: { key: string }) => {
                    if (key === 'concluir') {
                        await concluirTarefa(record.id);
                    }
                };

                return (
                    <Dropdown menu={{ items, onClick: handleMenuClick }}>
                        <Button shape="circle" icon={<ThunderboltOutlined />} />
                    </Dropdown>
                );
            }
        },
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_: any, record: any) => {
                if (editingId === record.id) {
                    return (
                        <Form.Item style={{ margin: 0 }}>
                            <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onBlur={() => handleSalvarTitulo(record.id)}
                                onPressEnter={() => handleSalvarTitulo(record.id)}
                                autoFocus
                            />
                        </Form.Item>
                    );
                }
                return (
                    <div onClick={() => { setEditingId(record.id); setEditingTitle(record.title); }} style={{ cursor: 'pointer' }}>
                        {record.title}
                    </div>
                );
            }
        },
        {
            title: 'Data Final',
            dataIndex: 'end_time',
            key: 'end_time',
            width: 140,
            render: (data: string) => data ? new Date(data).toLocaleString('pt-BR') : 'Sem data',
        },
        {
            title: 'Urgência',
            dataIndex: 'urgency',
            key: 'urgency',
            width: 100,
            render: (urgency: string) => {
                const colors = { Low: 'green', Medium: 'gold', High: 'orange', Critical: 'red' };
                return urgency ? (
                    <Tag color={colors[urgency as keyof typeof colors]}>{urgency}</Tag>
                ) : (
                    <Tag>Baixa</Tag>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'completed',
            key: 'completed',
            width: 100,
            render: (completed: boolean) =>
                completed
                    ? <Tag color="green">Concluída</Tag>
                    : <Tag color="orange">Pendente</Tag>,
        },
    ];

    return (
        <Container>
            <TopBar >
                <Button icon={<BsPlusCircle />} type="primary" onClick={() => setModalVisible(true)}>
                    Nova Tarefa
                </Button>
            </TopBar>

            <TableContainer>
                <Table
                    columns={columns}
                    dataSource={tarefas}
                    rowKey={(r) => r.id}
                    scroll={{ y: 400 }}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                />
            </TableContainer>

            <NovaTarefaNegociacaoModal
                visible={modalVisible}
                negociacao={negociacao}
                cliente={cliente}
                onClose={() => setModalVisible(false)}
                onCreated={() => {
                    carregarTarefas();
                    setModalVisible(false);
                }}
            />
        </Container>
    );
};

export default NegociacaoTarefasTab;
