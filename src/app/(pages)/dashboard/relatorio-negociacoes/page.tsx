'use client';
import React from 'react';
import RelatorioCompletoNegociacoes from './components/RelatorioCompletoNegociacoes';
import {Container} from "@/app/(pages)/dashboard/relatorio-negociacoes/RelatoriosNegociacoes.styles";

const RelatorioNegociacoesPage = () => {
    return (
        <Container>
    <h1>📈 Relatório Completo das Negociações</h1>
    <RelatorioCompletoNegociacoes />
    </Container>
);
};

export default RelatorioNegociacoesPage;
