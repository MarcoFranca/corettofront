"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/api/axios";
import {Apolice, Apolices} from "@/types/interfaces";
import ApolicesTable from "./(component)/ApoliceTable";
import ApoliceFiltro from "./(component)/ApoliceFilter";
import { Container, Title, LoadingMessage, ErrorMessage } from "./ApolicesPage.styles";
import ApolicesOverview
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApolicesOverview";


const ApolicesPage: React.FC = () => {
    const { clientId } = useParams();
    const [apolices, setApolices] = useState<Apolice[]>([]);
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [visaoGeral, setVisaoGeral] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 📌 Função para agrupar Apólices em categorias
    const agruparApolices = (apolicesArray: Apolice[]): Apolices => {
        return {
            plano_saude: apolicesArray.filter(apolice => apolice.tipo === "plano_saude"),
            seguro_vida: apolicesArray.filter(apolice => apolice.tipo === "seguro_vida"),
            previdencia: apolicesArray.filter(apolice => apolice.tipo === "previdencia"),
            consorcio: apolicesArray.filter(apolice => apolice.tipo === "consorcio"),
            investimento: apolicesArray.filter(apolice => apolice.tipo === "investimento"),
            seguro_profissional: apolicesArray.filter(apolice => apolice.tipo === "seguro_profissional"),
            seguro_residencial: apolicesArray.filter(apolice => apolice.tipo === "seguro_residencial"),
        };
    };

    useEffect(() => {
        fetchApolices();
    }, [tipoFiltro, statusFiltro, visaoGeral, clientId]);

    const fetchApolices = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get<Apolice[]>(
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

            <ApolicesTable setApolices={setApolices} apolices={apolices} />
        </Container>
    );
};

export default ApolicesPage;
