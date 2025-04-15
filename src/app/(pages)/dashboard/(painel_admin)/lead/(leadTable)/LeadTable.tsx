"use client";

import React, {useEffect, useRef, useState} from "react";
import {Button, Drawer, Dropdown, MenuProps, Table, Tag, Tooltip} from "antd";
import { useAppDispatch, useAppSelector } from "@/services/hooks/hooks";
import {
    fetchClientes,
    deleteCliente,
    updateCliente,
    createCliente,
    fetchTodosClientesFiltrados
} from "@/store/slices/clientesSlice";
import {Cliente, NegociacaoCliente} from "@/types/interfaces";
import {ContainerCanva} from "./LeadTable.styles";
import { getWhatsAppLink } from "@/utils/functions";
import { FaWhatsapp } from "react-icons/fa";
import { formatPhoneNumber } from "@/utils/maskUtils";
import { Key } from 'react';
import ScheduleMeetingForm from "@/app/components/Modal/meeting/ScheduleMeetingForm";
import EditLeadModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/EditLead";
import {sanitizeLeadForCreate, useConfirm} from "@/services/hooks/useConfirm"; // ✅ correto
import { useLeadBackup } from "@/services/hooks/useLeadBackup";
import {playSound} from "@/store/slices/soundSlice";
import NegociacoesModal from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/NegociacoesModal"; // caminho correto dependendo de onde criou
import { ColumnsType } from "antd/es/table";
import {BsThreeDotsVertical} from "react-icons/bs";
import NegotiationWizardModal
    from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/NegotiationWizardModal";
import IndicadoresNegociacoes from "@/app/components/strategy/IndicadoresNegociacoes";
import ClientePerfilDrawer from "@/app/components/cliente/ClientePerfilDrawer"; // ajuste o caminho se necessário



const LeadTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientes = useAppSelector((state) => state.clientes.clientes);
    const [filteredLeads, setFilteredLeads] = useState<Cliente[]>([]);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Cliente | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [negociacoesModalVisible, setNegociacoesModalVisible] = useState(false);
    const [negociacoesSelecionadas, setNegociacoesSelecionadas] = useState<NegociacaoCliente[]>([]);
    const [showNegotiationWizard, setShowNegotiationWizard] = useState(false);
    const [showClienteDrawer, setShowClienteDrawer] = useState(false);

    const { confirm } = useConfirm();
    const { saveBackup, getBackup } = useLeadBackup();

    useEffect(() => {
        dispatch(fetchTodosClientesFiltrados({ status: ["lead", "negociacao", "nova_negociacao"] }));
    }, [dispatch]);

    useEffect(() => {
        if (Array.isArray(clientes) && clientes.length > 0) {
            const apenasLeads = clientes.filter((cliente: Cliente) =>
                ["lead", "negociacao", "nova_negociacao"].includes(cliente.status)
            );
            setFilteredLeads(apenasLeads);
        }
    }, [clientes]);


    const prevEditModalOpen = useRef<boolean>(false);
    useEffect(() => {
        if (prevEditModalOpen.current !== isEditModalOpen) {
            dispatch(playSound(isEditModalOpen ? "openModal" : "closeModal"));
            prevEditModalOpen.current = isEditModalOpen;
        }
    }, [isEditModalOpen, dispatch]);

    const prevScheduleOpen = useRef<boolean>(false);
    useEffect(() => {
        if (prevScheduleOpen.current !== showScheduleForm) {
            dispatch(playSound(showScheduleForm ? "openModal" : "closeModal"));
            prevScheduleOpen.current = showScheduleForm;
        }
    }, [showScheduleForm, dispatch]);

    const [tableHeight, setTableHeight] = useState(430);

    useEffect(() => {
        const updateHeight = () => {
            const headerOffset = 430; // ajuste conforme seu layout (header, cards, margens)
            const alturaDisponivel = window.innerHeight - headerOffset;
            setTableHeight(alturaDisponivel);
        };

        updateHeight(); // inicial
        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, []);



    const handleDelete = (id: string) => {
        const leadToDelete = filteredLeads.find((lead: Cliente) => lead.id === id);
        if (leadToDelete) saveBackup(id, leadToDelete); // 🔐 salve o lead antes de deletar

        confirm({
            title: "Excluir Lead",
            message: "Tem certeza que deseja excluir esse lead?",
            sound: "delete",
            successMessage: "Lead excluído com sucesso!",
            minDuration: 800,
            onConfirm: async () => {
                await dispatch(deleteCliente(id)).unwrap();
            },
            undo: {
                label: "Desfazer",
                onUndo: () => {
                    const raw = getBackup(id); // ✅ agora o hook existe
                    if (!raw) return;
                    const cleaned = sanitizeLeadForCreate(raw);
                    dispatch(createCliente(cleaned));
                },
            },
        });
    };


    const STATUS_REUNIAO_MAP: Record<string, string> = {
        "reuniao_marcada": "Reunião Marcada",
        "retornar": "Retornar",
        "nao_tem_interesse": "Não Tem Interesse",
        "nao_atendeu": "Não Atendeu",
        "marcar_reuniao": "Marcar Reunião"
    };

    const handleScheduleFormClose = () => {
        setShowScheduleForm(false);

        if (selectedLead) {
            const updatedLead: Partial<Cliente> = {
                status_reuniao: "reuniao_marcada" as Cliente["status_reuniao"], // ✅ Apenas o campo necessário
            };

            // 🚀 Atualiza apenas o status da reunião
            dispatch(updateCliente({ id: selectedLead.id, updatedCliente: updatedLead }));

            // 🚀 Recarrega os leads para refletir a mudança
            dispatch(fetchClientes({ status: "lead,negociacao,nova_negociacao" }));
        }
    };

    const parceirosUnicos = Array.from(
        new Set(
            clientes
                .map((c) => c.indicado_por_detalhes)
                .filter(
                    (i): i is NonNullable<Cliente["indicado_por_detalhes"]> =>
                        !!i && i.tipo === "parceiro" && typeof i.nome === "string"
                )
                .map((i) => i.nome)
        )
    ).map((nome) => ({
        text: `Parceiro: ${nome}`,
        value: `parceiro:${nome}`,
    }));

    const clientesIndicadores = Array.from(
        new Set(
            clientes
                .map((c) => c.indicado_por_detalhes)
                .filter(
                    (i): i is NonNullable<Cliente["indicado_por_detalhes"]> =>
                        !!i && i.tipo === "cliente" && typeof i.nome === "string"
                )
                .map((i) => i.nome)
        )
    ).map((nome) => ({
        text: `Cliente: ${nome}`,
        value: `cliente:${nome}`,
    }));

    useEffect(() => {
        if (showClienteDrawer) dispatch(playSound("openModal"));
    }, [showClienteDrawer, dispatch]);



    const filtrosFixos = [
        { text: "Sem Indicação", value: "sem_indicacao" },
        { text: "Indicado por Parceiro", value: "tipo:parceiro" },
        { text: "Indicado por Cliente", value: "tipo:cliente" },
    ];

    const filtroIndicacao = [...filtrosFixos, ...parceirosUnicos, ...clientesIndicadores];

    const columns : ColumnsType<Cliente> = [
        {
            title: "Ações",
            key: "actions",
            fixed: "right",
            width: 70,
            render: (_: unknown, record: Cliente) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'edit',
                        label: '✏️ Editar',
                        onClick: () => {
                            setSelectedLead(record);
                            setIsEditModalOpen(true);
                        }
                    },
                    {
                        key: 'negociar',
                        label: '⚡ Negociação',
                        onClick: () => {
                            setSelectedLead(record);
                            setShowNegotiationWizard(true);
                        }
                    },
                    {
                        key: 'delete',
                        label: '🗑️ Excluir',
                        danger: true,
                        onClick: () => handleDelete(record.id),
                    }
                ];

                return (
                    <Dropdown menu={{ items }} trigger={["hover"]}>
                        <Button icon={<BsThreeDotsVertical />} />
                    </Dropdown>
                );
            }
        },
        {
            title: "Nome Completo",
            key: "nome_completo",
            width: 200,
            ellipsis: true,
            render: (_: any, record: Cliente) => (
                <Tooltip title={`${record.nome} ${record.sobre_nome}`}>
    <span
        style={{ cursor: "pointer", color: "#1677ff", fontWeight: 500 }}
        onClick={() => {
            setSelectedLead(record);
            setShowClienteDrawer(true);
        }}
    >
      {`${record.nome} ${record.sobre_nome}`}
    </span>
                </Tooltip>
            ),

        },
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
            title: "Próxima Reunião",
            dataIndex: "proxima_reuniao",
            key: "proxima_reuniao",
            responsive: ['md'],
            render: (data: string | null) =>
                data ? new Date(data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Nenhuma agendada",
        },
        {
            title: "Negociações",
            dataIndex: "relacionamentos.negociacoes", // esse valor é ignorado quando usamos render()
            key: "negociacoes",
            render: (_: any, record: Cliente) => {
                const negociacoes = record.relacionamentos?.negociacoes || [];
                const total = negociacoes.length;

                const ultimaReuniao = negociacoes
                    .flatMap(n => n.reunioes || [])
                    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())[0];

                return (
                    <Tooltip title="Clique para ver os detalhes">
        <span
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => {
                setNegociacoesSelecionadas(negociacoes);
                setNegociacoesModalVisible(true);
            }}
        >
          {total} negociação{total !== 1 ? "es" : ""}
            {ultimaReuniao && (
                <span style={{ marginLeft: 6 }}>
              📅 {new Date(ultimaReuniao.start_time).toLocaleDateString("pt-BR")}
            </span>
            )}
        </span>
                    </Tooltip>
                );
            }
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
                { text: "Clientes Ativos", value: "clientes ativos" },
                { text: "Clientes Pesrdidos", value: "clientes perdidos" },
            ],
            onFilter: (value: boolean | Key, record: Cliente) => record.pipeline_stage === value,
        },
        // {
        //     title: "Negociação Ativa?",
        //     key: "negociacao_ativa",
        //     filters: [
        //         { text: "Sim", value: "sim" },
        //         { text: "Não", value: "nao" }
        //     ],
        //     onFilter: (value: boolean | Key, record: Cliente): boolean => {
        //         const negociacoes = record.relacionamentos?.negociacoes || [];
        //         const hasAtiva = negociacoes.some((n) => !n.encerrada);
        //         return value === "sim" ? hasAtiva : !hasAtiva;
        //     },
        //     render: (_: any, record: Cliente) => {
        //         const negociacoes = record.relacionamentos?.negociacoes || [];
        //         const hasAtiva = negociacoes.some((n) => !n.encerrada);
        //         return hasAtiva ? (
        //             <Tag color="blue">Ativa</Tag>
        //         ) : (
        //             <Tag color="gray">Sem negociação</Tag>
        //         );
        //     }
        // },
        {
            title: "Apólice Ativa?",
            dataIndex: "possui_apolice_ativa",
            key: "possui_apolice_ativa",
            width: 130, // ⬅️ isso ajuda a dar respiro
            filters: [
                { text: "Sim", value: "true" },
                { text: "Não", value: "false" }
            ],
            onFilter: (value: Key | boolean, record: Cliente) =>
                value === "true" ? !!record.possui_apolice_ativa : !record.possui_apolice_ativa,
            render: (possui: boolean) =>
                possui ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>,
        },

        {
            title: "Status Reunião",
            dataIndex: "status_reuniao",
            key: "status_reuniao",
            filters: Object.entries(STATUS_REUNIAO_MAP).map(([value, text]) => ({ text, value })),
            onFilter: (value: boolean | Key, record: Cliente) => record.status_reuniao === value,
            render: (status: string) => (
                <span>{STATUS_REUNIAO_MAP[status] || "Desconhecido"}</span> // ✅ Mostra rótulo correto
            ),
        },
        {
            title: "Observações",
            dataIndex: "observacoes",
            key: "observacoes",
            render: (obs: string) => (
                obs ? (
                    <Tooltip title={obs}>
                        <span>{obs.length > 50 ? `${obs.substring(0, 50)}...` : obs}</span>
                    </Tooltip>
                ) : "Nenhuma observação"
            ),
        },
        {
            title: "Indicação",
            dataIndex: "indicado_por_detalhes",
            key: "indicado_por_detalhes",
            filters: filtroIndicacao,
            onFilter: (value, record) => {
                const indicacao = record.indicado_por_detalhes;

                if (value === "sem_indicacao") return !indicacao;
                if (value === "tipo:parceiro") return indicacao?.tipo === "parceiro";
                if (value === "tipo:cliente") return indicacao?.tipo === "cliente";

                if (!indicacao || typeof value !== "string") return false;

                const [tipo, nome] = value.split(":");
                return indicacao.tipo === tipo && indicacao.nome === nome;
            },
            render: (indicado_por_detalhes: any) =>
                indicado_por_detalhes
                    ? indicado_por_detalhes.tipo === "cliente"
                        ? <Tooltip title={indicado_por_detalhes.nome}>
                            <strong>Cliente:</strong> {indicado_por_detalhes.nome}
                        </Tooltip>
                        : <Tooltip title={indicado_por_detalhes.nome}>
                            <strong>Parceiro:</strong> {indicado_por_detalhes.nome}
                        </Tooltip>
                    : "Sem indicação",
        }


    ];

    return (
        <>
            <ContainerCanva>

                <h2>📋 Gestão Completa de Leads</h2>

                {/* 🔥 Indicadores Estratégicos */}
                <IndicadoresNegociacoes />
                {tableHeight > 100 && (

                    <Table
                        dataSource={filteredLeads}
                        columns={columns}
                        rowKey={(record) => record.id}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content', y: tableHeight || 430 }} // ⬅️ isso resolve o scroll lateral!
                    />
                )}
                {selectedLead && showScheduleForm && (
                    <ScheduleMeetingForm
                        entityId={selectedLead.id}
                        entityName={selectedLead.nome}
                        entityType="lead"
                        onClose={handleScheduleFormClose}
                    />
                )}

                {selectedLead && isEditModalOpen && (
                    <EditLeadModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        cliente={selectedLead}
                    />
                )}

            </ContainerCanva>
            <NegociacoesModal
                visible={negociacoesModalVisible}
                onClose={() => setNegociacoesModalVisible(false)}
                negociacoes={negociacoesSelecionadas}
            />
            {selectedLead && showNegotiationWizard && (
                <Drawer
                    title={`Negociação com ${selectedLead?.nome}`}
                    placement="right"
                    width={900}
                    onClose={() => setShowNegotiationWizard(false)}
                    open={showNegotiationWizard}
                    destroyOnClose
                >
                    <NegotiationWizardModal
                        isOpen={showNegotiationWizard}
                        onClose={() => setShowNegotiationWizard(false)}
                        cliente={selectedLead} // ✅ passa a prop correta
                    />

                </Drawer>
            )}
            {selectedLead && (
                <ClientePerfilDrawer
                    cliente={selectedLead}
                    open={showClienteDrawer}
                    onClose={() => setShowClienteDrawer(false)}
                />
            )}


        </>

    );
};

export default LeadTable;
