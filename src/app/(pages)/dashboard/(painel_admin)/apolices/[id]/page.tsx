"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/api/axios";
import PlanoSaudeDetalhes from "./PlanoSaudeDetalhes";
import SeguroVidaDetalhes from "./SeguroVidaDetalhes";
import ConsorcioDetalhes from "./ConsorcioDetalhes";
import { Loader, PageContainer } from "./ApoliceDetalhes.styles";
import {
    ApoliceConsorcio,
    ApoliceDetalhada,
    ApolicePlanoSaude,
    ApoliceSeguroAuto,
    ApoliceSeguroVida
} from "@/types/ApolicesInterface";
import SeguroAutoDetalhes from "@/app/(pages)/dashboard/(painel_admin)/apolices/[id]/SeguroAutoDetalhes";


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

    const tipoProduto = apolice.tipo_produto?.toLowerCase().replace(/_/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return (
        <PageContainer>
            {tipoProduto === "plano de saude" && (
                <PlanoSaudeDetalhes apolice={apolice as ApolicePlanoSaude} />
            )}
            {tipoProduto === "seguro de vida" && (
                <SeguroVidaDetalhes apolice={apolice as ApoliceSeguroVida} />
            )}
            {tipoProduto === "consorcio" && (
                <ConsorcioDetalhes apolice={apolice as ApoliceConsorcio} />
            )}
            {tipoProduto === "seguro auto" && (
                <SeguroAutoDetalhes apolice={apolice as ApoliceSeguroAuto} />
            )}
        </PageContainer>
    );

};

export default ApoliceDetalhesPage;
