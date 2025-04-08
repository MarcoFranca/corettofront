'use client';

import React from 'react';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import { Tag } from 'antd';
import { BsXCircle } from 'react-icons/bs';
import { Section, StyledButton } from '../NegotiationWizardModal.styles';
import {useAppDispatch} from "@/services/hooks/hooks";
import {toastError, toastSuccess} from "@/utils/toastWithSound";
import {updateNegotiation} from "@/store/slices/negociacoesSlice";

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
    statusLabels: Record<string, string>;
    onEncerrarClick: () => void;
}

const NegociacaoResumoTab: React.FC<Props> = ({ negociacao, statusLabels, onEncerrarClick }) => {

    const dispatch = useAppDispatch();

    console.log(negociacao)
    return (
        <Section>
            <h3>📄 Detalhes da Negociação</h3>
            <p><strong>Título:</strong> {negociacao.titulo}</p>

            <p>
                <strong>Status:</strong>{" "}
                <Tag>{statusLabels[negociacao.status] || negociacao.status}</Tag>
            </p>

            <p>
                <strong>Temperatura Atual:</strong>{" "}
                <Tag
                    color={
                        negociacao.interesse === "quente"
                            ? "red"
                            : negociacao.interesse === "morno"
                                ? "orange"
                                : "blue"
                    }
                >
                    {negociacao.interesse}
                </Tag>
            </p>

            {negociacao.sugestao_interesse && (
                <p style={{ marginTop: 8 }}>
                    <strong>Sugestão do Sistema:</strong>{" "}
                    <Tag
                        color={
                            negociacao.sugestao_interesse === "quente"
                                ? "red"
                                : negociacao.sugestao_interesse === "morno"
                                    ? "orange"
                                    : "blue"
                        }
                    >
                        {negociacao.sugestao_interesse}
                    </Tag>

                    {negociacao.sugestao_interesse !== negociacao.interesse && (
                        <StyledButton
                            type="link"
                            style={{ marginLeft: 12 }}
                            onClick={async () => {
                                try {
                                   await dispatch(updateNegotiation({
                                        id: negociacao.id,
                                        data: { interesse: negociacao.sugestao_interesse },
                                    })).unwrap();

                                    toastSuccess("Interesse atualizado com sucesso!");

                                    // Opcional: forçar refresh no pai se necessário
                                    // ou setNegociacaoAtiva(updated) se estiver controlando local

                                } catch (err) {
                                    console.error(err);
                                    toastError("Erro ao atualizar interesse.");
                                }
                            }}
                        >
                            📌 Usar sugestão
                        </StyledButton>
                    )}
                </p>
            )}

            <p>
                <strong>Observações:</strong>{" "}
                {Array.isArray(negociacao.observacoes)
                    ? negociacao.observacoes?.[0] || "Nenhuma"
                    : negociacao.observacoes || "Nenhuma"}
            </p>

            {!negociacao.encerrada && (
                <StyledButton
                    icon={<BsXCircle />}
                    type="primary"
                    danger
                    onClick={onEncerrarClick}
                >
                    Encerrar Negociação
                </StyledButton>
            )}
        </Section>
    );
};

export default NegociacaoResumoTab;
