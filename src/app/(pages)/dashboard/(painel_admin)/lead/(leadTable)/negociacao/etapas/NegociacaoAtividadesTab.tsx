'use client';

import React, { useEffect, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import api from '@/app/api/axios';
import { toastError } from '@/utils/toastWithSound';
import { Cliente, NegociacaoCliente, AtividadeNegociacao } from '@/types/interfaces';
import { Container, TopBar } from './NegociacaoReunioesTab.styles';
import { BsPlusCircle } from 'react-icons/bs';
import NovaAtividadeModal from '../modal/NovaAtividadeModal';

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
}

const NegociacaoAtividadesTab: React.FC<Props> = ({ negociacao }) => {
    const [atividades, setAtividades] = useState<AtividadeNegociacao[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        api.get(`/atividades-negociacao/?negociacao=${negociacao.id}`)
            .then(res => setAtividades(res.data))
            .catch(() => toastError("Erro ao carregar atividades."));
    }, [negociacao.id]);

    const columns = [
        { title: 'Data', dataIndex: 'data', render: (data: string) => new Date(data).toLocaleString("pt-BR") },
        { title: 'Título', dataIndex: 'titulo' },
        { title: 'Status', dataIndex: 'status', render: (status: string) => <Tag>{status}</Tag> },
        { title: 'Observações', dataIndex: 'observacoes', render: (obs: string) => obs || "Nenhuma" },
    ];

    return (
        <Container>
            <TopBar>
                <h3>📌 Atividades da Negociação</h3>
                <Button icon={<BsPlusCircle />} type="primary" onClick={() => setModalVisible(true)}>
                    Nova Atividade
                </Button>
            </TopBar>
            <Table dataSource={atividades} columns={columns} rowKey={(r) => r.id} pagination={false} />

            <NovaAtividadeModal
                visible={modalVisible}
                negociacao={negociacao}
                onClose={() => setModalVisible(false)}
                onSaved={(novaAtividade) => setAtividades(prev => [novaAtividade, ...prev])}
            />
        </Container>
    );
};

export default NegociacaoAtividadesTab;
