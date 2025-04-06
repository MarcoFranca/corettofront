// components/Modal/NegociacoesModal.tsx
import React from 'react';
import { Modal, Timeline, Tag } from 'antd';
import { NegociacaoCliente } from '@/types/interfaces';

interface Props {
    visible: boolean;
    onClose: () => void;
    negociacoes: NegociacaoCliente[];
}

const statusColorMap: Record<string, string> = {
    'em_andamento': 'blue',
    'encerrada': 'green',
    'em_espera': 'orange',
    'cancelada': 'red',
};

const NegociacoesModal: React.FC<Props> = ({ visible, onClose, negociacoes }) => {
    return (
        <Modal
            title="Negociações do Lead"
    open={visible}
    onCancel={onClose}
    footer={null}
    width={700}
        >
        {negociacoes.length === 0 ? (
                <p>Nenhuma negociação registrada.</p>
) : (
        negociacoes.map((negociacao, idx) => (
            <div key={negociacao.id} style={{ marginBottom: 20 }}>
    <h4>{idx + 1}. {negociacao.titulo} {' '}
    <Tag color={negociacao.encerrada ? "green" : "blue"}>
        {negociacao.encerrada ? "Encerrada" : "Ativa"}
        </Tag>
        </h4>

        <p><strong>Status:</strong> {negociacao.status} <br />
    <strong>Interesse:</strong> {negociacao.interesse}
    </p>

    <Timeline>
    {negociacao.reunioes?.length > 0 ? (
            negociacao.reunioes.map((reuniao, i) => (
                <Timeline.Item key={i} color="blue">
            {new Date(reuniao.start_time).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                })}
            </Timeline.Item>
))
) : (
        <Timeline.Item color="gray">Nenhuma reunião</Timeline.Item>
)}
    </Timeline>
    </div>
))
)}
    </Modal>
);
};

export default NegociacoesModal;
