'use client';

import React from 'react';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import { Tag } from 'antd';
import { BsXCircle } from 'react-icons/bs';
import { Section, StyledButton } from '../NegotiationWizardModal.styles';

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
    statusLabels: Record<string, string>;
    onEncerrarClick: () => void;
}

const NegociacaoResumoTab: React.FC<Props> = ({ negociacao, statusLabels, onEncerrarClick }) => {
    return (
        <Section>
            <h3>📄 Detalhes da Negociação</h3>
            <p><strong>Título:</strong> {negociacao.titulo}</p>

            <p>
                <strong>Status:</strong>{" "}
                <Tag>{statusLabels[negociacao.status] || negociacao.status}</Tag>
            </p>

            <p>
                <strong>Interesse:</strong>{" "}
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
