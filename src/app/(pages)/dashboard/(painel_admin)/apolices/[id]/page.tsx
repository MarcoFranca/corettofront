"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/api/axios";
import PlanoSaudeDetalhes from "./PlanoSaudeDetalhes";
import SeguroVidaDetalhes from "./SeguroVidaDetalhes";
import ConsorcioDetalhes from "./ConsorcioDetalhes";
import { Loader, PageContainer } from "./ApoliceDetalhes.styles";
import {ApoliceConsorcio, ApoliceDetalhada, ApolicePlanoSaude, ApoliceSeguroVida} from "@/types/ApolicesInterface";


const ApoliceDetalhesPage: React.FC = () => {
    const { id } = useParams();
    const [apolice, setApolice] = useState<ApoliceDetalhada | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchApoliceDetalhes = async () => {
            try {
                const response = await api.get(`/apolices/${id}/`);
                console.log(response)
                setApolice(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes da apólice:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApoliceDetalhes();
    }, [id]);

    if (loading) return <Loader>🔄 Carregando...</Loader>;
    if (!apolice) return <p>⚠️ Apólice não encontrada!</p>;

    return (
        <PageContainer>
            {apolice.tipo_produto.toLowerCase() === "plano de saúde" && (
                <PlanoSaudeDetalhes apolice={apolice as ApolicePlanoSaude} />
            )}
            {apolice.tipo_produto.toLowerCase() === "seguro de vida" && (
                <SeguroVidaDetalhes apolice={apolice as ApoliceSeguroVida} />
            )}
            {apolice.tipo_produto.toLowerCase() === "consórcio" && (
                <ConsorcioDetalhes apolice={apolice as ApoliceConsorcio} />
            )}

        </PageContainer>
    );
};

export default ApoliceDetalhesPage;
