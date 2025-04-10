// components/TodoList.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {Table, Button, Space, Tooltip, Tag, Input, Select, Switch, Modal} from 'antd';
import {PlusOutlined, EditOutlined, CheckOutlined, DeleteOutlined} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import {deleteTarefa, fetchTarefas, updateTarefa} from '@/store/slices/todoSlice';
import TodoDrawer from './TodoDrawer';
import { format, isSameDay, isThisMonth, isThisWeek} from 'date-fns';

const { Search } = Input;
const { Option } = Select;

const TodoList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tarefas, status } = useAppSelector((state) => state.todo);

    type RepeticaoFiltro = 'recorrente' | 'unica' | null;
    type PeriodoFiltro = 'hoje' | 'semana' | 'mes' | '' | null;

    const [filtros, setFiltros] = useState<{
        cliente: { value: string; label: string } | null;
        urgencia: string | null;
        busca: string;
        mostrarConcluidas: boolean;
        repeticao: RepeticaoFiltro;
        periodo: PeriodoFiltro;
    }>({
        cliente: null,
        urgencia: null,
        busca: '',
        mostrarConcluidas: false,
        repeticao: null,
        periodo: null,
    });


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

    const [inicializado, setInicializado] = useState(false);

    useEffect(() => {
        try {
            const savedFilters = localStorage.getItem('filtrosTarefas');
            if (savedFilters) {
                const parsed = JSON.parse(savedFilters);
                setFiltros({
                    cliente: parsed.cliente || null,
                    urgencia: parsed.urgencia || null,
                    busca: parsed.busca || '',
                    mostrarConcluidas: parsed.mostrarConcluidas ?? false,
                    repeticao: parsed.repeticao || null,
                    periodo: parsed.periodo || null,
                });
            }
        } catch (e) {
            console.warn("Erro ao restaurar filtros:", e);
        } finally {
            setInicializado(true);
        }
    }, []);

    useEffect(() => {
        if (inicializado) {
            localStorage.setItem('filtrosTarefas', JSON.stringify(filtros));
        }
    }, [filtros, inicializado]);



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

    const marcarConcluida = (tarefa: any) => {
        dispatch(updateTarefa({ id: tarefa.id, dados: { completed: true } }));
    };


    const tarefasFiltradas = tarefas.filter((t) => {
        const ehRecorrente = t.repeat && t.repeat !== 'none';
        const atendeRepeticao =
            filtros.repeticao === 'recorrente' ? ehRecorrente :
                filtros.repeticao === 'unica' ? !ehRecorrente :
                    true;

        const visivelPorConclusao = filtros.mostrarConcluidas || !t.completed;

        const end = t.end_time ? new Date(t.end_time) : null;
        const atendePeriodo =
            !filtros.periodo ||
            (filtros.periodo === 'hoje' && end && isSameDay(end, new Date())) ||
            (filtros.periodo === 'semana' && end && isThisWeek(end, { weekStartsOn: 1 })) ||
            (filtros.periodo === 'mes' && end && isThisMonth(end));

        return (
            atendeRepeticao &&
            visivelPorConclusao &&
            atendePeriodo &&
            t.title.toLowerCase().includes(filtros.busca.toLowerCase()) &&
            (!filtros.cliente || t.cliente === filtros.cliente.value) &&
            (!filtros.urgencia || t.urgency === filtros.urgencia)
        );
    });


    const colunas = [
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: any) => (
                <Tooltip title={record.description|| 'Sem descrição'}>
                    <span style={{ textDecoration: record.completed ? 'line-through' : 'none' }}>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Urgência',
            dataIndex: 'urgency',
            key: 'urgency',
            render: (urg: string) => {
                const cores: Record<string, string> = {
                    Low: 'green',
                    Medium: 'gold',
                    High: 'orange',
                    Critical: 'red',
                };
                return <Tag color={cores[urg]}>{urg}</Tag>;
            },
        },
        {
            title: 'Data Final',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (data: string) =>
                data
                    ? format(new Date(data), 'dd/MM/yyyy HH:mm')
                    : <i style={{ color: '#aaa' }}>Sem data para concluir</i>,
        },
        {
            title: 'Concluída',
            dataIndex: 'completed',
            key: 'completed',
            render: (c: boolean) => (c ? <Tag color="blue">Sim</Tag> : <Tag color="gray">Não</Tag>),
        },
        {
            title: "Repetição",
            key: "repeat_display",
            render: (_: any, record: any) => {
                if (record.repeat === 'none') return <Tag>Única</Tag>;

                const labels: Record<string, string> = {
                    daily: "🔁 Diário",
                    weekly: "📆 Semanal",
                    monthly: "🗓️ Mensal",
                };

                return (
                    <Space>
                        <Tag color="purple">{labels[record.repeat]}</Tag>
                        {record.repeat_forever
                            ? <Tag color="blue">♾️</Tag>
                            : record.repeat_count
                                ? <Tag>{record.repeat_count}x</Tag>
                                : null}
                    </Space>
                );
            }
        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Editar">
                        <Button icon={<EditOutlined />} onClick={() => editarTarefa(record)} />
                    </Tooltip>
                    <Tooltip title="Cancelar">
                        <Button danger icon={<DeleteOutlined />} onClick={() => confirmarCancelamento(record)} />
                    </Tooltip>
                    {!record.completed && (
                        <Tooltip title="Concluir">
                            <Button icon={<CheckOutlined />} onClick={() => marcarConcluida(record)} />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 16 }}>📝 Lista de Tarefas</h2>

            <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Search
                    placeholder="Buscar por título..."
                    value={filtros.busca}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, busca: e.target.value }))}
                    style={{ width: 250 }}
                />

                <Select
                    placeholder="Filtrar por urgência"
                    value={filtros.urgencia || ''}
                    onChange={(v) =>
                        setFiltros((prev) => ({ ...prev, urgencia: v === '' ? null : v }))
                    }
                    style={{ width: 100 }}
                >
                    <Option value="">Todos</Option>
                    <Option value="Low">Baixa</Option>
                    <Option value="Medium">Média</Option>
                    <Option value="High">Alta</Option>
                    <Option value="Critical">Crítica</Option>
                </Select>

                <Select
                    placeholder="Filtrar por período"
                    value={filtros.periodo}
                    onChange={(val) => setFiltros((prev) => ({ ...prev, periodo: val }))}
                    style={{ width: 120 }}
                >
                    <Option value="">Todos</Option>
                    <Option value="hoje">Hoje</Option>
                    <Option value="semana">Esta semana</Option>
                    <Option value="mes">Este mês</Option>
                </Select>


                <div style={{ width: 250 }}>
                    <Select
                        placeholder="Filtrar por repetição"
                        value={filtros.repeticao || ''}
                        style={{ width: 140 }}
                        onChange={(v) =>
                            setFiltros((prev) => ({
                                ...prev,
                                repeticao: (v as 'recorrente' | 'unica' | null) || null,
                            }))
                        }
                        allowClear
                    >
                        <Option value="">Todas</Option>
                        <Option value="recorrente">🔁 Recorrentes</Option>
                        <Option value="unica">📌 Não recorrentes</Option>
                    </Select>


                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Switch
                        checked={filtros.mostrarConcluidas}
                        onChange={(checked) => setFiltros((prev) => ({ ...prev, mostrarConcluidas: checked }))}
                    />
                    <span style={{ marginLeft: 8 }}>Mostrar concluídas</span>
                </div>

                <Button icon={<PlusOutlined />} type="primary" onClick={abrirNovaTarefa}>
                    Nova Tarefa
                </Button>
            </Space>

            <Table
                dataSource={tarefasFiltradas}
                columns={colunas}
                rowKey="id"
                loading={status === 'loading'}
                pagination={{ pageSize: 10 }}
            />

            <TodoDrawer
                key={tarefaSelecionada?.id || 'nova'}
                open={drawerAberto}
                onClose={() => setDrawerAberto(false)}
                modoEdicao={modoEdicao}
                tarefa={tarefaSelecionada}
            />
        </div>
    );
};

export default TodoList;
