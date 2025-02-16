"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/api/axios";
import { Apolices, Apolice } from "@/types/interfaces";
import ApolicesOverview from "./(component)/ApolicesOverview";
import ApolicesTable from "./(component)/ApoliceTable";
import ApolicesModal from "./(component)/ApolicesModal";
import { Container, Title, StyledButton, LoadingMessage, ErrorMessage } from "./ApolicesPage.styles";

const ApolicesPage: React.FC = () => {
    const { clientId } = useParams();

    const [apolices, setApolices] = useState<Apolices | null>(null);
    const [apolicesArray, setApolicesArray] = useState<Apolice[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (clientId) {
            fetchApolices();
        }
    }, [clientId]);

    const fetchApolices = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get<Apolices>(`/apolices/?cliente=${clientId}`);
            setApolices(response.data);

            const todasApolices: Apolice[] = Object.values(response.data)
                .flat()
                .filter((apolice): apolice is Apolice => apolice !== undefined);

            setApolicesArray(todasApolices);
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

            {loading && <LoadingMessage>🔄 Carregando apólices...</LoadingMessage>}
            {error && <ErrorMessage>❌ {error}</ErrorMessage>}

            {apolices && <ApolicesOverview apolices={apolices} />}
            <ApolicesTable apolices={apolicesArray} />

            <StyledButton onClick={() => setIsModalOpen(true)}>+ Nova Apólice</StyledButton>
            <ApolicesModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onSave={fetchApolices} />
        </Container>
    );
};

export default ApolicesPage;
