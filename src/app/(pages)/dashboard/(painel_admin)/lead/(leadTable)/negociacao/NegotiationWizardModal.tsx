'use client';

import React, { useEffect, useState } from 'react';
import {Button, Spin, Select, Modal, message} from 'antd';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import NovaNegociacaoModal from './modal/NovaNegociacaoModal';
import { closeNegotiation } from "@/store/slices/negociacoesSlice";
import { useAppDispatch } from "@/services/hooks/hooks";
import {
    Container,
    Header,
    HeaderInfo,
    HeaderActions,
    Section,
    StyledTabs,
} from './NegotiationWizardModal.styles';
import {
    BsCalendar,
    BsClipboardCheck,
    BsPencil,
    BsChatDots, BsXCircle,
} from 'react-icons/bs';
import { fetchClienteById, updateClienteStatus } from "@/store/slices/clientesSlice";
import { toastError, toastSuccess } from "@/utils/toastWithSound";
import NegociacaoReunioesTab from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoReunioesTab";
import NegociacaoAtividadesTab from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoAtividadesTab";
import NegociacaoObservacoesTab from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoObservacoesTab";
import NegociacaoResumoTab from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoResumoTab";
import NegociacaoTarefasTab from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoTarefasTab";
import { fetchMeetingsByNegociacao } from "@/store/slices/meetingSlice";
import NegociacaoDadosTab from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoDadosTab";
import api from "@/app/api/axios";

interface NegotiationWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    cliente: Cliente;
}

const statusLabels: Record<string, string> = {
    marcar_reuniao: 'Marcar Reunião',
    reuniao_marcada: 'Reunião Marcada',
    retornar: 'Retornar',
    nao_atendeu: 'Não Atendeu',
    nao_tem_interesse: 'Não Tem Interesse',
};

const NegotiationWizardModal: React.FC<NegotiationWizardModalProps> = ({ isOpen, cliente }) => {
    const [loading, setLoading] = useState(true);
    const [negociacoes, setNegociacoes] = useState<NegociacaoCliente[]>([]);
    const [negociacaoAtiva, setNegociacaoAtiva] = useState<NegociacaoCliente | null>(null);
    const [activeTab, setActiveTab] = useState('resumo');
    const [modalEncerrar, setModalEncerrar] = useState(false);
    const [motivoEncerramento, setMotivoEncerramento] = useState('');
    const [showNovaNegociacaoModal, setShowNovaNegociacaoModal] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (cliente && isOpen) {
            const todasNegociacoes = cliente.relacionamentos?.negociacoes || [];
            setNegociacoes(todasNegociacoes);

            if (todasNegociacoes.length > 0) {
                setNegociacaoAtiva(todasNegociacoes[todasNegociacoes.length - 1]);
            } else {
                setNegociacaoAtiva(null);
            }

            setLoading(false);
        }
    }, [cliente, isOpen]);

    const todasEncerradas = negociacoes.length > 0 && negociacoes.every(n => n.encerrada);

    const handleEncerrar = async () => {
        if (!negociacaoAtiva || !motivoEncerramento) return;

        const isPositiva = motivoEncerramento === 'ganhou';
        const isPerdeu = motivoEncerramento === 'perdeu';
        const isDesistiu = motivoEncerramento === 'desistiu';

        const novoStatusNegociacao = isPositiva
            ? 'fechado'
            : isPerdeu
                ? 'recusada'
                : 'cliente_desistiu';

        try {
            const payloadNegociacao = {
                id: negociacaoAtiva.id,
                data: {
                    status: novoStatusNegociacao,
                    encerrada: true,
                    ...(isPositiva ? {} : { motivo_recusa: motivoEncerramento }),
                },
            };

            const result = await dispatch(closeNegotiation(payloadNegociacao)).unwrap();

            const aindaTemNegociacoesAbertas = negociacoes.some(
                (n) => !n.encerrada && n.id !== negociacaoAtiva.id
            );

            if (!aindaTemNegociacoesAbertas) {
                const possuiApoliceAtiva = cliente.possui_apolice_ativa;

                let novoStatusCliente = cliente.status; // fallback, caso dê algo inesperado

                if (isPositiva || possuiApoliceAtiva) {
                    novoStatusCliente = 'ativo';
                } else if (isPerdeu || isDesistiu) {
                    novoStatusCliente = 'recusado';
                }

                await dispatch(updateClienteStatus({
                    id: cliente.id,
                    status: novoStatusCliente,
                }));
                await dispatch(fetchClienteById(cliente.id)).unwrap();

            }

            setNegociacoes((prev) =>
                prev.map((n) => (n.id === result.id ? result : n))
            );
            setNegociacaoAtiva(result);

            toastSuccess("Negociação encerrada com sucesso!");
            setModalEncerrar(false);
        } catch (error) {
            toastError("Erro ao encerrar negociação.");
            console.error("Erro ao encerrar negociação:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <Container>
            <Header>
                <HeaderInfo>
                    <h2>🤝 Estratégia de Negociação</h2>
                    <HeaderActions>
                        <Select
                            value={negociacaoAtiva?.id}
                            onChange={(id) => {
                                const selecionada = negociacoes.find((n) => n.id === id) || null;
                                setNegociacaoAtiva(selecionada);
                            }}
                            options={negociacoes.map((n) => ({
                                label: (
                                    <span style={{
                                        color: n.encerrada ? "#aaa" : "#042a75",
                                        fontStyle: n.encerrada ? "italic" : "normal",
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
            {n.encerrada && <BsXCircle style={{ marginRight: 4, color: "#e74c3c" }} />}
                                        {n.titulo}{n.encerrada ? " (Encerrada)" : ""}
          </span>
                                ),
                                value: n.id,
                            }))}
                            style={{ minWidth: 220 }}
                        />

                        <Button type="primary" onClick={() => setShowNovaNegociacaoModal(true)}>
                            + Nova Negociação
                        </Button>

                        {negociacaoAtiva?.encerrada && (
                            <Button
                                type="default"
                                style={{
                                    marginLeft: 12,
                                    borderColor: "#33cccc",
                                    color: "#042a75",
                                    fontWeight: 500
                                }}
                                onClick={async () => {
                                    try {
                                        await api.post(`/negociacoes/${negociacaoAtiva.id}/reativar/`);
                                        message.success("Negociação reativada com sucesso!");
                                        // Atualize o cliente/negociações aqui:
                                        const clienteAtualizado = await dispatch(fetchClienteById(cliente.id)).unwrap();
                                        const novasNegociacoes = clienteAtualizado.relacionamentos?.negociacoes || [];
                                        setNegociacoes(novasNegociacoes);
                                        setNegociacaoAtiva(novasNegociacoes.find((n: NegociacaoCliente) => n.id === negociacaoAtiva.id));
                                    } catch (err) {
                                        message.error("Erro ao reativar negociação!");
                                    }
                                }}
                            >
                                🔄 Reativar Negociação
                            </Button>
                        )}
                    </HeaderActions>
                    <p>
                        <strong>Cliente:</strong> {cliente?.nome || '---'}
                    </p>
                </HeaderInfo>
            </Header>



            {loading ? (
                <Spin size="large" style={{ marginTop: '2rem' }} />
            ) : negociacaoAtiva ? (
                <>
                    <StyledTabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: 'resumo',
                                label: <span><BsClipboardCheck /> Resumo</span>,
                                children: (
                                    <NegociacaoResumoTab
                                        cliente={cliente}
                                        negociacao={negociacaoAtiva}
                                        statusLabels={statusLabels}
                                        onEncerrarClick={() => setModalEncerrar(true)}
                                    />
                                ),
                            },
                            {
                                key: 'reunioes',
                                label: <span><BsCalendar /> Reuniões</span>,
                                children: (
                                    <NegociacaoReunioesTab
                                        negociacao={negociacaoAtiva}
                                        cliente={cliente}
                                        onReuniaoAtualizada={async () => {
                                            if (negociacaoAtiva?.id) {
                                                await dispatch(fetchMeetingsByNegociacao(negociacaoAtiva.id));
                                            }
                                        }}
                                    />
                                ),
                            },
                            {
                                key: 'tarefas',
                                label: <span><BsClipboardCheck /> Tarefas</span>,
                                children: (
                                    <NegociacaoTarefasTab
                                        cliente={cliente}
                                        negociacao={negociacaoAtiva}
                                    />
                                ),
                            },
                            {
                                key: 'atividades',
                                label: <span><BsPencil /> Atividades</span>,
                                children: (
                                    <NegociacaoAtividadesTab
                                        cliente={cliente}
                                        negociacao={negociacaoAtiva}
                                    />
                                ),
                            },
                            {
                                key: 'observacoes',
                                label: <span><BsChatDots /> Observações</span>,
                                children: (
                                    <NegociacaoObservacoesTab
                                        cliente={cliente}
                                        negociacao={negociacaoAtiva}
                                    />
                                ),
                            },
                            {
                                key: 'dados',
                                label: <span>👤 Dados Principais</span>,
                                children: (
                                    <NegociacaoDadosTab cliente={cliente} negociacao={negociacaoAtiva} />
                                ),
                            },
                        ]}
                    />

                    <Modal
                        title="Encerrar Negociação"
                        open={modalEncerrar}
                        onCancel={() => setModalEncerrar(false)}
                        onOk={handleEncerrar}
                        okText="Encerrar"
                        cancelText="Cancelar"
                    >
                        <p>Informe o motivo do encerramento:</p>
                        <Select
                            style={{ width: '100%' }}
                            value={motivoEncerramento}
                            onChange={setMotivoEncerramento}
                            options={[
                                { value: 'ganhou', label: '✅ Ganhamos a venda' },
                                { value: 'perdeu', label: '❌ Perdemos para concorrente' },
                                { value: 'desistiu', label: '⚪ Cliente desistiu' },
                            ]}
                        />
                    </Modal>

                </>
            ) : (
                <Section>
                    <h3>⚠️ Negociação ativa não encontrada</h3>
                    <p>Não conseguimos localizar uma negociação ativa.</p>
                    <Button type="primary" onClick={() => setShowNovaNegociacaoModal(true)}>
                        + Iniciar Nova Negociação
                    </Button>
                </Section>
            )}

            <NovaNegociacaoModal
                visible={showNovaNegociacaoModal}
                onClose={() => setShowNovaNegociacaoModal(false)}
                cliente={cliente}
                onCreated={async (id) => {
                    try {
                        const clienteAtualizado = await dispatch(fetchClienteById(cliente.id)).unwrap();
                        const novasNegociacoes = clienteAtualizado.relacionamentos?.negociacoes || [];
                        const nova = novasNegociacoes.find((n: NegociacaoCliente) => n.id === id);

                        setNegociacoes(novasNegociacoes);
                        if (nova) setNegociacaoAtiva(nova);
                    } catch (error) {
                        console.error("Erro ao atualizar cliente após nova negociação", error);
                    }
                }}
            />
        </Container>
    );
};

export default NegotiationWizardModal;
