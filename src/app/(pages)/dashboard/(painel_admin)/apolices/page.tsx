"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { fetchApolices } from "@/store/slices/apoliceSlice";
import { Apolice } from "@/types/interfaces";
import ApoliceWizard from "./(ApolicesWizard)/ApolicesWizard";
import ApolicesTable from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceTable";
import ApoliceFilter from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceFilter";

import {ApolicesContainer, HeaderContainer, StyledButton, Title, ContentContainer, FilterContainer, IconButton}
    from "./ApolicesPage.styles";
import {Drawer} from "antd";
import {FaPlus} from "react-icons/fa";

const ApolicesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [apolices, setApolices] = useState<Apolice[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [tipoFiltro, setTipoFiltro] = useState<string>('');
    const [statusFiltro, setStatusFiltro] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApolicesList = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultAction = await dispatch(
                fetchApolices({
                    tipo: tipoFiltro,
                    status: statusFiltro,
                })
            ).unwrap();
            setApolices(resultAction);
        } catch (error) {
            console.error("Erro ao buscar apólices:", error);
            setError("Erro ao buscar apólices.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApolicesList();
    }, [tipoFiltro, statusFiltro]);

    const handleWizardClose = () => {
        setIsWizardOpen(false);
        fetchApolicesList();
    };

    return (
        <ApolicesContainer>
            <HeaderContainer>
                <Title>📑 Gestão de Apólices</Title>
                <StyledButton onClick={() => setIsWizardOpen(true)}>
                    <IconButton><FaPlus /></IconButton> Nova Apólice
                </StyledButton>
            </HeaderContainer>

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

            <>
                {loading && <p>🔄 Carregando apólices...</p>}
                {error && <p style={{ color: 'red' }}>❌ {error}</p>}
                <ApolicesTable apolices={apolices} />
            </>

            {/* 🧩 Modal de Cadastro - Agora Drawer Tela Cheia */}
            <Drawer
                title="Cadastro de Apólice"
                placement="right"
                closable={true}
                onClose={handleWizardClose}
                open={isWizardOpen}
                width="100vw" // ✅ Tela inteira
                height="100vh" // ✅ Ocupa toda a altura
                styles={{
                    body: { padding: 0, transition: "all 0.3s ease-in-out" },
                    header: { fontSize: "20px", fontWeight: "bold" }
                }}
            >
                <ApoliceWizard onClose={handleWizardClose} />
            </Drawer>
        </ApolicesContainer>
    );
};

export default ApolicesPage;
