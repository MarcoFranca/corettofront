// components/TodoList.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tooltip, Tag, Input, Select, Switch, Modal } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import {deleteTarefa, fetchTarefas, Tarefa, updateTarefa} from '@/store/slices/todoSlice';
import TodoDrawer from './TodoDrawer';
import { format} from 'date-fns';
import { DatePicker } from 'antd';
import dayjs from "dayjs";
import styles from './styles.module.css';
const { RangePicker } = DatePicker;

const { Search } = Input;
const { Option } = Select;

const TodoList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tarefas, status } = useAppSelector((state) => state.todo);

    function carregarFiltrosSalvos() {
        try {
            const salvos = JSON.parse(localStorage.getItem('filtrosTarefas') || '{}');
            return {
                cliente: salvos.cliente ?? '',
                negociacao: salvos.negociacao ?? '',
                urgencia: salvos.urgencia ?? '',
                busca: salvos.busca ?? '',
                mostrarConcluidas: !!salvos.mostrarConcluidas,
                mostrarAtrasadas: !!salvos.mostrarAtrasadas,
                dataInicio: salvos.dataInicio ? new Date(salvos.dataInicio) : null,
                dataFim: salvos.dataFim ? new Date(salvos.dataFim) : null,
            };
        } catch (e) {
            console.warn("Erro ao carregar filtros do localStorage:", e);
            return {
                cliente: '',
                negociacao: '',
                urgencia: '',
                busca: '',
                mostrarConcluidas: false,
                mostrarAtrasadas: false,
                dataInicio: null,
                dataFim: null,
            };
        }
    }

    const [filtros, setFiltros] = useState(carregarFiltrosSalvos());



    useEffect(() => {
        const filtrosParaSalvar = {
            ...filtros,
            dataInicio: filtros.dataInicio?.toISOString() ?? null,
            dataFim: filtros.dataFim?.toISOString() ?? null,
        };
        localStorage.setItem('filtrosTarefas', JSON.stringify(filtrosParaSalvar));
    }, [filtros]);



    const [drawerAberto, setDrawerAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [tarefaSelecionada, setTarefaSelecionada] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchTarefas());
    }, [dispatch]);

    const confirmarCancelamento = (tarefa: any) => {
        if (tarefa.repeat !== 'none') {
            Modal.confirm({
                title: "Cancelar tarefa recorrente",
                content: "Deseja cancelar apenas esta tarefa ou todas as futuras?",
                okText: "Todas as futuras",
                cancelText: "Apenas esta",
                onOk: () => dispatch(deleteTarefa({ id: tarefa.id, emSerie: true })),
                onCancel: () => dispatch(deleteTarefa({ id: tarefa.id })),
            });
        } else {
            dispatch(deleteTarefa({ id: tarefa.id }));
        }
    };

    const abrirNovaTarefa = () => {
        setTarefaSelecionada(null);
        setModoEdicao(false);
        setDrawerAberto(true);
    };

    const editarTarefa = (tarefa: any) => {
        setTarefaSelecionada(tarefa);
        setModoEdicao(true);
        setDrawerAberto(true);
    };

    const toggleConclusao = (tarefa: Tarefa) => {
        dispatch(updateTarefa({ id: tarefa.id, dados: { completed: !tarefa.completed } }));
    };


    const tarefasFiltradas = tarefas.filter((t: Tarefa) => {
        const atendeCliente = !filtros.cliente || (t.cliente_label?.toLowerCase().includes(filtros.cliente.toLowerCase()));
        const atendeNegociacao = !filtros.negociacao || (t.negociacao_titulo?.toLowerCase().includes(filtros.negociacao.toLowerCase()));
        const atendeUrgencia = !filtros.urgencia || t.urgency === filtros.urgencia;
        const atendeBusca = t.title.toLowerCase().includes(filtros.busca.toLowerCase());
        const atendeConcluidas = filtros.mostrarConcluidas || !t.completed;
        const atendeAtrasadas = !filtros.mostrarAtrasadas || (t.end_time && new Date(t.end_time) < new Date() && !t.completed);

        const atendeDataPersonalizada =
            (!filtros.dataInicio || (t.end_time && new Date(t.end_time) >= filtros.dataInicio)) &&
            (!filtros.dataFim || (t.end_time && new Date(t.end_time) <= filtros.dataFim));

        return atendeCliente && atendeNegociacao && atendeUrgencia && atendeBusca && atendeConcluidas && atendeAtrasadas && atendeDataPersonalizada;
    });

    const colunas = [
        {
            title: 'Título',
            dataIndex: 'title',
            render: (text: string, record: Tarefa) => {
                const icones = [];

                if (record.negociacao_titulo) icones.push("📌");
                if (record.completed) icones.push("✅");
                if (!record.completed && record.end_time && new Date(record.end_time) < new Date()) icones.push("⏰");

                return (
                    <Tooltip title={record.description || 'Sem descrição'}>
            <span style={{ textDecoration: record.completed ? 'none' : 'none' }}>
                {icones.join(' ')} {text}
            </span>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente_label',
            render: (cliente: string) => cliente || "—",
        },
        {
            title: 'Negociação',
            dataIndex: 'negociacao_titulo',
            render: (neg: string, record: any) => neg ? (
                <Space>
                    {neg}
                    <Tooltip title="Abrir negociação">
                        <Button size="small" icon={<LinkOutlined />} onClick={() => window.open(`/dashboard/negociacao/${record.negociacao}`, '_blank')} />
                    </Tooltip>
                </Space>
            ) : '—',
        },
        {
            title: 'Urgência',
            dataIndex: 'urgency',
            render: (urg: string) => (
                <Tag color={{ Low: 'green', Medium: 'gold', High: 'orange', Critical: 'red' }[urg]}>
                    {urg}
                </Tag>
            ),
        },
        {
            title: 'Data Final',
            dataIndex: 'end_time',
            render: (data: string) => data ? format(new Date(data), 'dd/MM/yyyy HH:mm') : "—",
        },
        {
            title: 'Status',
            dataIndex: 'completed',
            render: (c: boolean, record: Tarefa) => {
                const isLate = record.end_time && new Date(record.end_time) < new Date() && !record.completed;
                return c
                    ? <Tag icon={<CheckOutlined />} color="green">Concluída</Tag>
                    : isLate
                        ? <Tag color="red">🔴 Atrasada</Tag>
                        : <Tag color="orange">Pendente</Tag>;
            }
        },
        {
            title: 'Ações',
            render: (_: any, record: Tarefa) => (
                <Space>
                    <Tooltip title="Editar">
                        <Button icon={<EditOutlined />} onClick={() => editarTarefa(record)} />
                    </Tooltip>
                    <Tooltip title="Cancelar">
                        <Button danger icon={<DeleteOutlined />} onClick={() => confirmarCancelamento(record)} />
                    </Tooltip>
                    <Tooltip title={record.completed ? "Desfazer Conclusão" : "Concluir"}>
                        <Button
                            icon={<CheckOutlined />}
                            onClick={() => toggleConclusao(record)}
                            type={record.completed ? "default" : "primary"}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>📝 Lista de Tarefas</h2>

            <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Search placeholder="Buscar título..." onChange={e => setFiltros(f => ({ ...f, busca: e.target.value }))} style={{ width: 200 }} />
                <Input placeholder="Filtrar por cliente" onChange={e => setFiltros(f => ({ ...f, cliente: e.target.value }))} style={{ width: 180 }} />
                <Input placeholder="Filtrar por negociação" onChange={e => setFiltros(f => ({ ...f, negociacao: e.target.value }))} style={{ width: 180 }} />
                <Select placeholder="Urgência" allowClear onChange={v => setFiltros(f => ({ ...f, urgencia: v }))} style={{ width: 120 }}>
                    {['Low', 'Medium', 'High', 'Critical'].map(u => <Option key={u}>{u}</Option>)}
                </Select>
                <RangePicker
                    ranges={{
                        'Hoje': [dayjs(), dayjs()],
                        'Últimos 7 dias': [dayjs().subtract(7, 'day'), dayjs()],
                        'Últimos 30 dias': [dayjs().subtract(30, 'day'), dayjs()],
                        'Este mês': [dayjs().startOf('month'), dayjs().endOf('month')],
                    }}
                    onChange={(dates) => {
                        setFiltros(f => ({
                            ...f,
                            dataInicio: dates?.[0]?.toDate() || null,
                            dataFim: dates?.[1]?.toDate() || null,
                        }));
                    }}
                />
                <Switch checked={filtros.mostrarConcluidas} onChange={c => setFiltros(f => ({ ...f, mostrarConcluidas: c }))} /> Mostrar concluídas
                <Switch checked={filtros.mostrarAtrasadas} onChange={c => setFiltros(f => ({ ...f, mostrarAtrasadas: c }))} /> Atrasadas
                <Button icon={<PlusOutlined />} type="primary" onClick={abrirNovaTarefa}>Nova Tarefa</Button>
            </Space>

            <Table
                rowClassName={(record) => {
                    const isAtrasada = record.end_time && new Date(record.end_time) < new Date() && !record.completed;
                    if (record.completed) return styles['tarefa-concluida'];
                    if (isAtrasada) return styles['tarefa-atrasada'];
                    return '';
                }}
                dataSource={tarefasFiltradas} columns={colunas} rowKey="id" loading={status === 'loading'} pagination={{ pageSize: 10 }} />
            <TodoDrawer open={drawerAberto} onClose={() => setDrawerAberto(false)} modoEdicao={modoEdicao} tarefa={tarefaSelecionada} />
        </div>
    );
};

export default TodoList;
