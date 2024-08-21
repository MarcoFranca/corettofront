'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchApoliceDetalhe, getApoliceDetalhe, getApolicesStatus, getApolicesError } from '@/store/slices/apoliceSlice';
import ClienteDashboardLayout from "@/app/components/layouts/ClienteDashboardLayout";
import {
    FichaContainer,
    GridContainer,
    Field,
    Label,
    StatusField,
    StatusVigente,
    StatusCancelada,
    PDFViewer,
    BackButton,
    PDFContainer, ApoliceContainer, FichaHeader
} from './ApoliceDetalhes.styles';
import Link from 'next/link';
import { Apolice } from '@/types/interfaces';
import {Container} from "postcss";


const ApoliceDetalhes = () => {
    const dispatch = useAppDispatch();
    const params = useParams();

    // Garantindo que clientId seja uma string
    const clientId = Array.isArray(params.clientId) ? params.clientId[0] : params.clientId;
    const apoliceId = Array.isArray(params.apoliceId) ? params.apoliceId[0] : params.apoliceId;
    const produtoTipo = Array.isArray(params.produto) ? params.produto[0] : params.produto;

    const apoliceDetalhe = useAppSelector(getApoliceDetalhe);
    const status = useAppSelector(getApolicesStatus);
    const error = useAppSelector(getApolicesError);

    useEffect(() => {
        if (apoliceId && produtoTipo) {
            dispatch(fetchApoliceDetalhe({ produto: produtoTipo, apoliceId }));
        }
    }, [apoliceId, produtoTipo, dispatch]);

    if (status === 'loading') {
        return <p>Carregando os detalhes da apólice...</p>;
    }

    if (status === 'failed') {
        return <p>Erro: {error}</p>;
    }

    return (
        <ClienteDashboardLayout clientId={clientId}>
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
                            {apoliceDetalhe.status_proposta ? <StatusVigente>Vigente</StatusVigente> : <StatusCancelada>Cancelada</StatusCancelada>}
                        </StatusField>
                        <GridContainer>
                            <Field><Label>Número da Apólice:</Label> {apoliceDetalhe.numero_apolice}</Field>
                            <Field><Label>Seguradora:</Label> {apoliceDetalhe.seguradora}</Field>
                            <Field><Label>Início da Vigência:</Label> {apoliceDetalhe.data_inicio}</Field>
                            <Field><Label>Final da Vigência:</Label> {apoliceDetalhe.data_vencimento}</Field>
                            <Field><Label>Prêmio Pago:</Label> R$ {apoliceDetalhe.premio_pago}</Field>
                            <Field><Label>Forma de Pagamento:</Label> {apoliceDetalhe.forma_pagamento}</Field>
                            <Field><Label>Periodicidade:</Label> {apoliceDetalhe.periodicidade_pagamento}</Field>
                            {apoliceDetalhe.arquivo && (
                                <Field>
                                    <Label>Arquivo da Apólice:</Label>
                                    <a href={apoliceDetalhe.arquivo} target="_blank" rel="noopener noreferrer">Visualizar/Download</a>
                                </Field>
                            )}
                            {renderSpecificFields(apoliceDetalhe)}
                        </GridContainer>
                    </>
                ) : (
                    <p>Não foi possível carregar os detalhes da apólice.</p>
                )}
            </FichaContainer>
        </ClienteDashboardLayout>
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
                    <Field><Label>Valor de Reembolso de Consulta:</Label> R$ {apoliceDetalhe.valor_reembolso_consulta}</Field>
                    <Field><Label>Coparticipação:</Label> {apoliceDetalhe.coparticipacao ? 'Sim' : 'Não'}</Field>
                </>
            );
        case 'seguro_vida':
            return (
                <>
                    <Field><Label>Subcategoria:</Label> {apoliceDetalhe.subcategoria}</Field>
                    <Field><Label>Beneficiário:</Label> {apoliceDetalhe.beneficiario}</Field>
                    <Field><Label>Capital Segurado:</Label> R$ {apoliceDetalhe.capital_segurado}</Field>
                </>
            );
        default:
            return null;
    }
};
