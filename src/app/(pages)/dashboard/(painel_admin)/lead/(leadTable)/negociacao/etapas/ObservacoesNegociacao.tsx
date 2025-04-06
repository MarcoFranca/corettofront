
'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import { useAppDispatch } from '@/services/hooks/hooks';
import api from '@/app/api/axios';
import { toastSuccess, toastError } from '@/utils/toastWithSound';

interface Observacao {
    id: string;
    texto: string;
    created_at: string;
    autor_nome: string;
}

interface ObservacoesNegociacaoProps {
    negociacaoId: string;
    observacoes: Observacao[];
}

const ObservacoesNegociacao: React.FC<ObservacoesNegociacaoProps> = ({ negociacaoId, observacoes }) => {
    const dispatch = useAppDispatch();
    const [novaObservacao, setNovaObservacao] = useState('');
    const [loading, setLoading] = useState(false);
    const [itens, setItens] = useState<Observacao[]>(observacoes || []);

    const handleSubmit = async () => {
        if (!novaObservacao.trim()) {
            toastError('Digite algo antes de salvar.');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/observacoes-negociacao/', {
                texto: novaObservacao,
                negociacao: negociacaoId
            });

            setItens(prev => [response.data, ...prev]);
            setNovaObservacao('');
            toastSuccess('Observação adicionada com sucesso!');
        } catch (err) {
            toastError('Erro ao salvar observação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Titulo>📝 Linha do Tempo da Negociação</Titulo>

            <InputWrapper>
                <Textarea
                    rows={3}
                    value={novaObservacao}
                    onChange={(e) => setNovaObservacao(e.target.value)}
                    placeholder="Digite uma nova observação..."
                />
                <AddButton onClick={handleSubmit} disabled={loading}>
                    <FaPlus /> Adicionar
                </AddButton>
            </InputWrapper>

            <Timeline>
                {itens.map((obs) => (
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

export default ObservacoesNegociacao;

const Container = styled.div`
  padding: 1rem;
`;

const Titulo = styled.h3`
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Textarea = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
`;

const AddButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Icone = styled.div`
  font-size: 1.5rem;
  color: #0070f3;
`;

const Conteudo = styled.div`
  flex: 1;
`;

const Cabecalho = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const Autor = styled.span`
  font-weight: bold;
`;

const Data = styled.span`
  color: #666;
`;

const Texto = styled.p`
  margin: 0;
`;
