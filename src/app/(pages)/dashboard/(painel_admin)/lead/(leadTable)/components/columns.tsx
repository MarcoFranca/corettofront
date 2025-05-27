import React, {type Key} from "react";
import {Tag, Tooltip, Dropdown, Button, Menu} from "antd";
import { FaWhatsapp } from "react-icons/fa";
import { formatPhoneNumber } from "@/utils/maskUtils";
import { getWhatsAppLink } from "@/utils/functions";
import type { ColumnsType } from "antd/es/table";
import type { Cliente, NegociacaoCliente } from "@/types/interfaces";
import { TableActions } from "./TableActions";
import {CheckCircleOutlined, EditOutlined, ExclamationCircleOutlined, ThunderboltOutlined} from "@ant-design/icons";
import {capitalizeName} from "@/utils/utils";
import {statusMap} from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/helpers/functions";
import {
    atualizarReuniaoRapida,
    getNextMeeting,
    getStartTime,
    getStatusReuniao
} from "@/services/helpers/meetingHelpers";
import {updateCliente} from "@/store/slices/clientesSlice";
import ObservacaoCell from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/components/ObservacaoCell";
import {useAppDispatch} from "@/services/hooks/hooks";

export const STATUS_REUNIAO_MAP: Record<string, string> = {
    reuniao_marcada: "Reunião Marcada",
    retornar: "Retornar",
    nao_tem_interesse: "Não Tem Interesse",
    nao_atendeu: "Não Atendeu",
    marcar_reuniao: "Marcar Reunião",
};

interface LeadTableColumnsProps {
    setSelectedLead: (c: Cliente) => void;
    setIsEditModalOpen: (open: boolean) => void;
    setShowNegotiationWizard: (open: boolean) => void;
    handleDelete: (id: string) => void;
    setNegociacoesSelecionadas: (n: NegociacaoCliente[]) => void;
    setNegociacoesModalVisible: (open: boolean) => void;
    setShowClienteDrawer: (open: boolean) => void;
    filtroIndicacao: any[];
    negociacoesVistas: Record<string, string>;
    marcarComoVisto: (id: string) => void;
    foiVistoHoje: (id: string) => boolean;
}


// Função que retorna as columns prontas
export function getLeadTableColumns({
                                        setSelectedLead,
                                        setIsEditModalOpen,
                                        setShowNegotiationWizard,
                                        handleDelete,
                                        setNegociacoesSelecionadas,
                                        setNegociacoesModalVisible,
                                        setShowClienteDrawer,
                                        filtroIndicacao,
                                        negociacoesVistas,
                                        marcarComoVisto,
                                        foiVistoHoje,
                                    }: LeadTableColumnsProps): ColumnsType<Cliente> {
const dispatch = useAppDispatch();
    return [
        {
            title: "Ações",
            key: "actions",
            fixed: "right" as const, // <--- Aqui corrige o erro TS do fixed
            width: 70,
            render: (_: unknown, record: Cliente) => (
                <TableActions
                    record={record}
                    setSelectedLead={setSelectedLead}
                    setIsEditModalOpen={setIsEditModalOpen}
                    setShowNegotiationWizard={setShowNegotiationWizard}
                    handleDelete={handleDelete}
                    foiVistoHoje={foiVistoHoje}
                />
            )
        },
        {
            title: "Nome Completo",
            key: "nome_completo",
            width: 200,
            ellipsis: true,
            render: (_: any, record: Cliente) => (
                <Tooltip title="Abrir negociação">
            <span
                style={{
                    cursor: "pointer",
                    color: foiVistoHoje(record.id) ? "#52c41a" : "#1677ff",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                }}
                onClick={() => {
                    setSelectedLead(record);
                    setShowNegotiationWizard(true);
                    marcarComoVisto(record.id);
                }}
            >
                {capitalizeName(`${record.nome} ${record.sobre_nome}`)}
                {foiVistoHoje(record.id) && <CheckCircleOutlined style={{ color: "#52c41a" }} />}
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
                    <FaWhatsapp color="#25D366" />{formatPhoneNumber(telefone)}
                </a>
            ),
        },
        {
            title: "Negociações",
            key: "negociacoes",
            render: (_: any, record: Cliente) => {
                const total = (record.negociacoes || []).length;
                return (
                    <span
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                        onClick={() => {
                            setNegociacoesSelecionadas(record.negociacoes || []);
                            setNegociacoesModalVisible(true);
                        }}>
                {total} negociação{total !== 1 ? "es" : ""}
            </span>
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
                { text: "Clientes Perdidos", value: "clientes perdidos" },
            ],
            onFilter: (value: boolean | Key, record: Cliente) => record.pipeline_stage === value,
        },
        {
            title: "Apólice Ativa?",
            dataIndex: "possui_apolice_ativa",
            key: "possui_apolice_ativa",
            width: 130,
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
            title: "Próxima Reunião",
            key: "proxima_reuniao",
            render: (_: any, record: Cliente) => {
                const reunioes = (record.negociacoes || []).flatMap(n => n.reunioes || []);
                const proxima = getNextMeeting(reunioes);

                if (!proxima) return "Nenhuma agendada";

                const status = getStatusReuniao(proxima);
                const start = getStartTime(proxima) || "";
                const dataReuniao = start ? new Date(start) : null;

                const now = new Date();
                const estaAtrasada =
                    !!dataReuniao &&
                    dataReuniao < now &&
                    status &&
                    ["agendada", "remarcada", "confirmada"].includes(status);

                const statusInfo = status ? statusMap[status] : null;

                const menu = (
                    <Menu
                        onClick={async ({ key }) => {
                            // Exemplo PATCH rápido
                            await atualizarReuniaoRapida(proxima.id, key);
                        }}
                        items={[
                            { label: "Confirmar", key: "confirmada" },
                            { label: "Realizada", key: "realizada" },
                            { label: "No-show", key: "no_show" },
                            { label: "Remarcada", key: "remarcada" },
                            { label: "Cancelada", key: "cancelada" },
                        ]}
                    />
                );

                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    {dataReuniao?.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                    {estaAtrasada && (
                        <Tag color="red" icon={<ExclamationCircleOutlined />}>Atrasada</Tag>
                    )}
                    {statusInfo && (
                        <Tag color={statusInfo.color} icon={statusInfo.icon}>
                            {statusInfo.label}
                        </Tag>
                    )}
                </span>
                    </Dropdown>
                );
            }
        },
        {
            title: "Observações",
            dataIndex: "observacoes",
            key: "observacoes",
            render: (obs: string, record: Cliente) => (
                <ObservacaoCell
                    obs={obs}
                    onSave={async (newObs) => {
                        await dispatch(updateCliente({ id: record.id, updatedCliente: { observacoes: newObs } }));
                    }}
                />
            )
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
}
