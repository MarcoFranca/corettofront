'use client';

import React, { useEffect, useState } from 'react';
import { Button, Spin, Tag, Select, Modal } from 'antd';
import {Cliente, NegociacaoCliente} from '@/types/interfaces';
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
    StyledButton
} from './NegotiationWizardModal.styles';
import {
    BsCalendar,
    BsClipboardCheck,
    BsPencil,
    BsChatDots,
    BsXCircle
} from 'react-icons/bs';
import {fetchClienteById, updateClienteStatus} from "@/store/slices/clientesSlice";
import {toastError, toastSuccess} from "@/utils/toastWithSound";
import NegociacaoReunioesTab
    from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoReunioesTab";
import NegociacaoAtividadesTab
    from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoAtividadesTab";
import NegociacaoObservacoesTab
    from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoObservacoesTab";

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
            setLoading(true);
            const todasNegociacoes = cliente.relacionamentos?.negociacoes || [];
            const ultima = todasNegociacoes[todasNegociacoes.length - 1] || null;
            setNegociacoes(todasNegociacoes);
            setNegociacaoAtiva(ultima);
            setLoading(false);
        }
    }, [cliente, isOpen]);

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
                    <p><strong>Cliente:</strong> {cliente?.nome || '---'}</p>
                </HeaderInfo>
                <HeaderActions>
                    <Select
                        value={negociacaoAtiva?.id}
                        onChange={(id) => {
                            const selecionada = negociacoes.find((n) => n.id === id) || null;
                            setNegociacaoAtiva(selecionada);
                        }}
                        options={negociacoes.map((n) => ({
                            label: `${n.titulo}${n.encerrada ? ' (Encerrada)' : ''}`,
                            value: n.id,
                        }))}
                        style={{ minWidth: 200 }}
                    />
                    <Button type="primary" onClick={() => setShowNovaNegociacaoModal(true)}>
                        + Nova Negociação
                    </Button>
                </HeaderActions>
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
                                    <Section>
                                        <h3>📄 Detalhes da Negociação</h3>
                                        <p><strong>Título:</strong> {negociacaoAtiva.titulo}</p>
                                        <p><strong>Status:</strong> <Tag>{statusLabels[negociacaoAtiva.status] || negociacaoAtiva.status}</Tag></p>
                                        <p><strong>Interesse:</strong> <Tag color={
                                            negociacaoAtiva.interesse === 'quente'
                                                ? 'red'
                                                : negociacaoAtiva.interesse === 'morno'
                                                    ? 'orange'
                                                    : 'blue'
                                        }>
                                            {negociacaoAtiva.interesse}
                                        </Tag></p>
                                        <p><strong>Observações:</strong> {negociacaoAtiva.observacoes || "Nenhuma"}</p>

                                        {!negociacaoAtiva.encerrada && (
                                            <StyledButton
                                                icon={<BsXCircle />}
                                                type="primary"
                                                danger
                                                onClick={() => setModalEncerrar(true)}
                                            >
                                                Encerrar Negociação
                                            </StyledButton>
                                        )}
                                    </Section>
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
                                            const clienteAtualizado = await dispatch(fetchClienteById(cliente.id)).unwrap();
                                            const novaNegociacao = clienteAtualizado.relacionamentos?.negociacoes.find(
                                                (n: NegociacaoCliente) => n.id === negociacaoAtiva?.id
                                            );
                                            if (novaNegociacao) setNegociacaoAtiva(novaNegociacao);
                                        }}
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
                                key: 'atividades',
                                label: <span><BsPencil /> Atividades</span>,
                                children: (
                                    <NegociacaoAtividadesTab
                                        cliente={cliente}
                                        negociacao={negociacaoAtiva}
                                    />
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

                </>
            ) : (
                <p>Nenhuma negociação encontrada.</p>
            )}
        </Container>
    );
};

export default NegotiationWizardModal;
