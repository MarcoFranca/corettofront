'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { message } from 'antd';
import api from '@/app/api/axios';
import { toastError, toastSuccess } from '@/utils/toastWithSound';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import {
    Autor,
    Cabecalho,
    Container, Conteudo, Data, Icone, InputWrapper, Item, Texto, Timeline, Titulo
} from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/negociacao/etapas/NegociacaoObservacoesTab.styles";
import {Textarea} from "@/app/components/Modal/meeting/ScheduleMeetingFormStyled.styles";
import {
    AddButton
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/StepCoberturas.styles";

interface Observacao {
    id: string;
    texto: string;
    created_at: string;
    autor_nome: string;
}

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
}

const NegociacaoObservacoesTab: React.FC<Props> = ({ negociacao }) => {
    const [observacoes, setObservacoes] = useState<Observacao[]>([]);
    const [novaObs, setNovaObs] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/observacoes-negociacao/?negociacao=${negociacao.id}`)
            .then(res => setObservacoes(res.data))
            .catch(() => toastError("Erro ao carregar observações."));
    }, [negociacao.id]);

    const handleAdicionar = async () => {
        if (!novaObs.trim()) {
            message.warning("Digite algo antes de salvar.");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/observacoes-negociacao/', {
                texto: novaObs,
                negociacao: negociacao.id,
            });

            setObservacoes(prev => [res.data, ...prev]);
            setNovaObs('');
            toastSuccess("Observação adicionada com sucesso!");
        } catch (err) {
            toastError("Erro ao salvar observação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Titulo>📝 Observações da Negociação</Titulo>

            <InputWrapper>
                <Textarea
                    rows={3}
                    value={novaObs}
                    onChange={(e) => setNovaObs(e.target.value)}
                    placeholder="Digite uma nova observação..."
                />
                <AddButton onClick={handleAdicionar} disabled={loading}>
                    <FaPlus /> Adicionar
                </AddButton>
            </InputWrapper>

            <Timeline>
                {observacoes.map((obs) => (
                    <Item key={obs.id}>
                        <Icone><FaUserCircle /></Icone>
                        <Conteudo>
                            <Cabecalho>
                                <Autor>{obs.autor_nome}</Autor>
                                <Data>{format(new Date(obs.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</Data>
                            </Cabecalho>
                            <Texto>{obs.texto}</Texto>
                        </Conteudo>
                    </Item>
                ))}
            </Timeline>
        </Container>
    );
};

export default NegociacaoObservacoesTab;

