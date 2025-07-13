"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/api/axios";
import ApolicesTable from "./(component)/ApoliceTable";
import ApoliceFiltro from "./(component)/ApoliceFilter";
import { Container, Title, LoadingMessage, ErrorMessage } from "./ApolicesPage.styles";
import ApolicesOverview
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApolicesOverview";
import {
    ApoliceConsorcio,
    ApoliceDetalhada,
    ApolicePlanoSaude,
    ApolicePrevidencia,
    ApolicesAgrupadas,
    ApoliceSeguroAuto,
    ApoliceSeguroVida
} from "@/types/ApolicesInterface";



const ApolicesPage: React.FC = () => {
    const { clientId } = useParams();
    const [apolices, setApolices] = useState<ApoliceDetalhada[]>([]);
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [visaoGeral, setVisaoGeral] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 📌 Função para agrupar Apólices em categorias
    const agruparApolices = (apolicesArray: ApoliceDetalhada[]): ApolicesAgrupadas => {
        return {
            plano_saude: apolicesArray.filter(apolice => apolice.tipo_produto === "Plano de Saúde") as ApolicePlanoSaude[],
            seguro_vida: apolicesArray.filter(apolice => apolice.tipo_produto === "Seguro de Vida") as ApoliceSeguroVida[],
            previdencia: apolicesArray.filter(apolice => apolice.tipo_produto === "Previdência") as ApolicePrevidencia[],
            consorcio: apolicesArray.filter(apolice => apolice.tipo_produto === "Consórcio") as ApoliceConsorcio[],
            investimento: apolicesArray.filter(apolice => apolice.tipo_produto === "Investimento"),
            seguro_profissional: apolicesArray.filter(apolice => apolice.tipo_produto === "Seguro Profissional"),
            seguro_residencial: apolicesArray.filter(apolice => apolice.tipo_produto === "Seguro Residencial"),
            seguro_auto: apolicesArray.filter(apolice => apolice.tipo_produto === "Seguro Auto") as ApoliceSeguroAuto[],
        };
    };


    useEffect(() => {
        fetchApolices();
    }, [tipoFiltro, statusFiltro, visaoGeral, clientId]);

    const fetchApolices = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get<ApoliceDetalhada[]>(
                `/apolices/?cliente=${clientId}&tipo=${tipoFiltro}&status=${statusFiltro}&visao_geral=${visaoGeral}`
            );
            setApolices(response.data);
        } catch (error) {
            console.error("Erro ao buscar apólices:", error);
            setError("Não foi possível carregar as apólices.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>📜 Apólices do Cliente</Title>
            {/* ✅ Mostra o Overview com agrupamento correto */}
            {apolices && <ApolicesOverview apolices={agruparApolices(apolices)} />}


            <ApoliceFiltro
                tipoFiltro={tipoFiltro}
                setTipoFiltro={setTipoFiltro}
                statusFiltro={statusFiltro}
                setStatusFiltro={setStatusFiltro}
                visaoGeral={visaoGeral}
                setVisaoGeral={setVisaoGeral}
                onFiltrar={fetchApolices}
            />

            {loading && <LoadingMessage>🔄 Carregando apólices...</LoadingMessage>}
            {error && <ErrorMessage>❌ {error}</ErrorMessage>}

            <ApolicesTable
                setApolices={setApolices}
                apolices={apolices}
                onEdit={() => {}} // função vazia só pra satisfazer o tipo
            />
        </Container>
    );
};

export default ApolicesPage;
