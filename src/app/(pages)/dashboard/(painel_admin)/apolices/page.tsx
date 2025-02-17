// 📂 ApolicesPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/hooks"; // ✅ Certifique-se que está importando `useAppDispatch`
import { fetchApolices } from "@/store/slices/apoliceSlice";
import { Apolice } from "@/types/interfaces";
import ApoliceWizard from "./(ApolicesWizard)/ApolicesWizard";
import ApolicesTable from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceTable";
import ApoliceFilter from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceFilter";

import {
    ApolicesContainer,
    HeaderContainer,
    StyledButton,
    Title,
    ContentContainer,
    FilterContainer
} from "./ApolicesPage.styles";

const ApolicesPage: React.FC = () => {
    const dispatch = useAppDispatch(); // ✅ Usamos `dispatch` do Redux
    const [apolices, setApolices] = useState<Apolice[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [tipoFiltro, setTipoFiltro] = useState<string>('');
    const [statusFiltro, setStatusFiltro] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Executamos o Redux Thunk com dispatch
    const fetchApolicesList = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultAction = await dispatch(
                fetchApolices({
                    tipo: tipoFiltro,
                    status: statusFiltro,
                })
            ).unwrap(); // ✅ `.unwrap()` para acessar diretamente os dados
            setApolices(resultAction);
        } catch (error) {
            console.error("Erro ao buscar apólices:", error);
            setError("Erro ao buscar apólices.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Atualiza ao mudar filtros
    useEffect(() => {
        fetchApolicesList();
    }, [tipoFiltro, statusFiltro]);

    const handleWizardClose = () => {
        setIsWizardOpen(false);
        fetchApolicesList(); // ✅ Atualiza a lista após o cadastro
    };

    return (
        <ApolicesContainer>
            {/* 🧩 Header */}
            <HeaderContainer>
                <Title>📑 Gestão de Apólices</Title>
                <StyledButton onClick={() => setIsWizardOpen(true)}>
                    + Nova Apólice
                </StyledButton>
            </HeaderContainer>

            {/* 🧩 Filtros */}
            <FilterContainer>
                <ApoliceFilter
                    setVisaoGeral={() => {}}
                    visaoGeral={false}
                    tipoFiltro={tipoFiltro}
                    setTipoFiltro={setTipoFiltro}
                    statusFiltro={statusFiltro}
                    setStatusFiltro={setStatusFiltro}
                    onFiltrar={fetchApolicesList}
                />
            </FilterContainer>

            {/* 🧩 Conteúdo */}
            <ContentContainer>
                {loading && <p>🔄 Carregando apólices...</p>}
                {error && <p style={{ color: 'red' }}>❌ {error}</p>}
                <ApolicesTable apolices={apolices} />
            </ContentContainer>

            {/* 🧩 Modal de Cadastro */}
            {isWizardOpen && (
                <ApoliceWizard onClose={handleWizardClose} />
            )}
        </ApolicesContainer>
    );
};

export default ApolicesPage;
