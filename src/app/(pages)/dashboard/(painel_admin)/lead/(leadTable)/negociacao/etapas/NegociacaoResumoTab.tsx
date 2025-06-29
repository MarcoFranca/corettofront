'use client';

import React, {useState} from 'react';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import {Modal, Tag} from 'antd';
import {BsArrowRepeat, BsPencilSquare, BsXCircle} from 'react-icons/bs';
import { Section, StyledButton } from '../NegotiationWizardModal.styles';
import {useAppDispatch} from "@/services/hooks/hooks";
import {toastError, toastSuccess} from "@/utils/toastWithSound";
import {updateNegotiation} from "@/store/slices/negociacoesSlice";
import api from "@/app/api/axios";

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
    statusLabels: Record<string, string>;
    onEncerrarClick: () => void;
}

const NegociacaoResumoTab: React.FC<Props> = ({ negociacao, statusLabels, onEncerrarClick }) => {

    const dispatch = useAppDispatch();
    // Dentro do componente, crie um estado:
    const [modalEditar, setModalEditar] = useState(false);
    const [tituloEdit, setTituloEdit] = useState(negociacao.titulo);
    const [obsEdit, setObsEdit] = useState(
        Array.isArray(negociacao.observacoes)
            ? negociacao.observacoes[0] || ''
            : negociacao.observacoes || ''
    );

// Função para salvar edição
    const handleSalvarEdicao = async () => {
        try {
            await dispatch(updateNegotiation({
                id: negociacao.id,
                data: {
                    titulo: tituloEdit,
                    observacoes: [obsEdit],  // Sempre envia um array de strings
                }
            })).unwrap();
            toastSuccess("Negociação atualizada!");
            setModalEditar(false);
        } catch (err) {
            toastError("Erro ao atualizar negociação!");
        }
    };

    {/* Dentro do return */}



    const handleReativar = async () => {
        try {
            await api.post(`/negociacoes/${negociacao.id}/reativar/`);
            toastSuccess("Negociação reativada com sucesso!");
            // Dica: atualize os dados do cliente/negociações no pai se necessário
        } catch (err) {
            toastError("Erro ao reativar negociação!");
        }
    };

    console.log(negociacao)
    return (
        <Section>
            <h3>📄 Detalhes da Negociação</h3>
            <p>
                <strong>Título:</strong> {negociacao.titulo}
                {/* Botão editar título (exemplo) */}
                <StyledButton
                    icon={<BsPencilSquare/>}
                    type="link"
                    style={{marginLeft: 8, padding: 0}}
                    onClick={() => setModalEditar(true)}
                />
            </p>
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
                <p style={{marginTop: 8}}>
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
                            style={{marginLeft: 12}}
                            onClick={async () => {
                                try {
                                    await dispatch(updateNegotiation({
                                        id: negociacao.id,
                                        data: {interesse: negociacao.sugestao_interesse},
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
                <StyledButton
                    icon={<BsPencilSquare/>}
                    type="link"
                    style={{marginLeft: 8, padding: 0}}
                    onClick={() => setModalEditar(true)}
                />
            </p>

            {/* Troca entre encerrar e reativar */}
            {!negociacao.encerrada ? (
                <StyledButton
                    icon={<BsXCircle />}
                    type="primary"
                    danger
                    onClick={onEncerrarClick}
                >
                    Encerrar Negociação
                </StyledButton>
            ) : (
                <StyledButton
                    icon={<BsArrowRepeat />}
                    type="primary"
                    onClick={handleReativar}
                >
                    Reativar Negociação
                </StyledButton>
            )}
            <Modal
                title="Editar Negociação"
                open={modalEditar}
                onOk={handleSalvarEdicao}
                onCancel={() => setModalEditar(false)}
                okText="Salvar"
                cancelText="Cancelar"
            >
                <div>
                    <label>Título:</label>
                    <input value={tituloEdit} onChange={e => setTituloEdit(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
                </div>
                <div>
                    <label>Observações:</label>
                    <textarea
                        value={obsEdit}
                        onChange={e => setObsEdit(e.target.value)}
                        style={{width: '100%'}}
                    />
                </div>
            </Modal>
        </Section>
    );
};

export default NegociacaoResumoTab;
