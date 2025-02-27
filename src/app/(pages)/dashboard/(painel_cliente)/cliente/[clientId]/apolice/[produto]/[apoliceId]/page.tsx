'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import {
    deleteApolice,
    selectApolicesStatus,
    selectApolicesError,
    selectApoliceDetalhe, fetchApoliceDetalhe
} from '@/store/slices/apoliceSlice';
import {
    FichaContainer,
    GridContainer,
    Field,
    Label,
    StatusField,
    StatusVigente,
    StatusCancelada,
    BackButton,
    FichaHeader,
    ActionButtons,
    EditButton,
    DeleteButton
} from './ApoliceDetalhes.styles';
import { formatMoney } from '@/utils/utils';
import { FaEdit, FaTrash } from "react-icons/fa";
import {Apolice} from "@/types/interfaces";
import Link from "next/link";
import ConfirmationModal from "@/app/components/Modal/confirm/ConfirmDeletModal";

const ApoliceDetalhes = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);  // Adicionando estado do modal

    // Garantindo que clientId seja uma string
    const clientId = Array.isArray(params.clientId) ? params.clientId[0] : params.clientId;
    const apoliceId = Array.isArray(params.apoliceId) ? params.apoliceId[0] : params.apoliceId;
    const produtoTipo = Array.isArray(params.produto) ? params.produto[0] : params.produto;

    const apoliceDetalhe = useAppSelector(selectApoliceDetalhe) as Apolice | null;
    const status = useAppSelector(selectApolicesStatus);
    const error = useAppSelector(selectApolicesError);

    useEffect(() => {
        if (apoliceId && produtoTipo) {
            dispatch(fetchApoliceDetalhe({ produto: produtoTipo, apoliceId })); // 🔥 Agora passamos o objeto corretamente
        }
    }, [apoliceId, produtoTipo, dispatch]);

    const handleDelete = () => {
        dispatch(deleteApolice({ apoliceId })).then(() => {
            router.push(`/dashboard/cliente/${clientId}/apolice`);
        });
    };


    if (!apoliceDetalhe || Object.keys(apoliceDetalhe).length === 0) {
        return <p>Carregando os detalhes da apólice...</p>;
    }

    if (status === 'failed') {
        return <p>Erro: {error}</p>;
    }

    return (
        <>
            <FichaContainer>
                <FichaHeader>
                    <h1>Detalhes da Apólice</h1>
                    <BackButton>
                        <Link href={`/dashboard/cliente/${clientId}/apolice`}>
                            Voltar para Apólices do Cliente
                        </Link>
                    </BackButton>
                </FichaHeader>
                {apoliceDetalhe ? (
                    <>
                        <StatusField>
                            <Label>Status da Apólice:</Label>
                            {apoliceDetalhe.status_proposta ? <StatusVigente>Vigente</StatusVigente> :
                                <StatusCancelada>Cancelada</StatusCancelada>}
                        </StatusField>
                        <GridContainer>
                            <Field><Label>Número da Apólice:</Label> {apoliceDetalhe.numero_apolice}</Field>
                            <Field><Label>Seguradora:</Label> {apoliceDetalhe.seguradora}</Field>
                            <Field><Label>Início da Vigência:</Label> {apoliceDetalhe.data_inicio}</Field>
                            <Field><Label>Final da Vigência:</Label> {apoliceDetalhe.data_vencimento}</Field>
                            <Field>
                                <Label>Prêmio Pago:</Label> {formatMoney(parseFloat(apoliceDetalhe.premio_pago?.toString() || "0"))}
                            </Field>
                            <Field><Label>Forma de Pagamento:</Label> {apoliceDetalhe.forma_pagamento}</Field>
                            <Field><Label>Periodicidade:</Label> {apoliceDetalhe.periodicidade_pagamento}</Field>
                            {apoliceDetalhe.arquivo && (
                                <Field>
                                    <Label>Arquivo da Apólice:</Label>
                                    <a href={apoliceDetalhe.arquivo} target="_blank"
                                       rel="noopener noreferrer">Visualizar/Download</a>
                                </Field>
                            )}
                            {apoliceDetalhe.observacoes && (
                                <Field>
                                    <Label>Observações:</Label> {apoliceDetalhe.observacoes}
                                </Field>
                            )}
                            {renderSpecificFields(apoliceDetalhe)}
                        </GridContainer>

                        {/* Botões de Ação */}
                        <ActionButtons>
                            <EditButton href={`/dashboard/cliente/${clientId}/apolice/${produtoTipo}/${apoliceId}/editar`}>
                                <FaEdit /> Editar
                            </EditButton>
                            <DeleteButton onClick={() => setIsModalOpen(true)}>
                                <FaTrash /> Deletar
                            </DeleteButton>
                        </ActionButtons>

                        {/* Modal de Confirmação */}
                            <ConfirmationModal
                                isOpen={isModalOpen}
                                onRequestClose={() => setIsModalOpen(false)}
                                onConfirm={handleDelete}
                                title="Confirmar Exclusão"
                                message="Tem certeza de que deseja excluir esta apólice? Esta ação é permanente."
                            />

                    </>
                ) : (
                    <p>Não foi possível carregar os detalhes da apólice.</p>
                )}
            </FichaContainer>
        </>
    );
};

export default ApoliceDetalhes;

// Função para renderizar campos específicos com base no tipo de apólice
const renderSpecificFields = (apoliceDetalhe: Apolice) => {
    switch (apoliceDetalhe.produto) {
        case 'plano_saude':
            return (
                <>
                    <Field><Label>Categoria:</Label> {apoliceDetalhe.categoria}</Field>
                    <Field><Label>Acomodação:</Label> {apoliceDetalhe.acomodacao}</Field>
                    <Field><Label>Abrangência:</Label> {apoliceDetalhe.abrangencia}</Field>
                    <Field>
                        <Label>Valor de Reembolso de Consulta:</Label>
                        {formatMoney(parseFloat(apoliceDetalhe.valor_reembolso_consulta?.toString() || "0"))}
                    </Field>
                    <Field><Label>Coparticipação:</Label> {apoliceDetalhe.coparticipacao ? 'Sim' : 'Não'}</Field>
                </>
            );
        case 'seguro_vida':
            return (
                <>
                    <Field><Label>Subcategoria:</Label> {apoliceDetalhe.subcategoria}</Field>
                    <Field><Label>Beneficiário:</Label> {apoliceDetalhe.beneficiario}</Field>
                    <Field><Label>Capital Segurado:</Label> {formatMoney(parseFloat(apoliceDetalhe.capital_segurado))}</Field>
                </>
            );
        default:
            return null;
    }
};
