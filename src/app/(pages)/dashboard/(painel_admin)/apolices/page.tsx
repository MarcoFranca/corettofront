"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/services/hooks/hooks";
import { fetchApolices } from "@/store/slices/apoliceSlice";
import ApoliceWizard from "./(ApolicesWizard)/ApolicesWizard";
const ApolicesTable = dynamic(() =>
    import('@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceTable'),
    { loading: () => <RouteChangeLoader /> });
import ApoliceFilter from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceFilter";

import {ApolicesContainer, HeaderContainer, StyledButton, Title, ContentContainer, FilterContainer, IconButton}
    from "./ApolicesPage.styles";
import {FaPlus} from "react-icons/fa";
import {DrawerContainer} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/ApoliceWizard.styles";
import api from "@/app/api/axios";
import KpiCardsApolices from "@/app/(pages)/dashboard/(painel_admin)/apolices/(kpiApolices)/KpiCards";
import RouteChangeLoader from "@/app/components/ui/loading/RouteChangeLoader";
import {useModalSoundEffect} from "@/services/hooks/useModalSoundEffect";
import {message} from "antd";
import {ApoliceDetalhada} from "@/types/ApolicesInterface";

const ApolicesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [apolices, setApolices] = useState<ApoliceDetalhada[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [tipoFiltro, setTipoFiltro] = useState<string>('');
    const [statusFiltro, setStatusFiltro] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingApolice, setEditingApolice] = useState<ApoliceDetalhada | undefined>(undefined);

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
        fetchStats();
    }, [tipoFiltro, statusFiltro]);


    const fetchStats = async () => {
        try {
            const response = await api.get("/dashboard/");
            setStats(response.data);
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    };

    const fetchApolicesData = async () => {
        setLoading(true);
        try {
            const result = await dispatch(fetchApolices({ tipo: tipoFiltro, status: statusFiltro })).unwrap();
            setApolices(result);
        } catch (error) {
            console.error("Erro ao buscar apólices:", error);
            setError("Erro ao buscar apólices.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApolicesData();
        fetchStats();
    }, [tipoFiltro, statusFiltro]);

    useModalSoundEffect(isWizardOpen);

    const handleWizardClose = () => {
        setIsWizardOpen(false);
        setEditingApolice(undefined); // ✅ limpa edição
        fetchApolicesList();          // ✅ atualiza lista
    }

    const [stats, setStats] = useState({
        clientes: {
            total: 0,
            leads: 0,
            ativos: 0,
            nova_negociacao: 0,
            novos_este_mes: 0,
            taxa_conversao: 0,
            indice_retencao: 0,
        },
        apolices: {
            total: 0,
            valor_total: 0,
            valor_mensalizado: 0,
            revisoes_este_mes: 0,
            por_tipo: {
                planosaude: 0,
                segurovida: 0,
                previdencia: 0,
                consorcio: 0,
                investimento: 0,
                seguroprofissional: 0,
                seguroresidencial: 0,
            },
        },
    });

    return (
        <ApolicesContainer>
            <HeaderContainer>
                <Title>📑 Gestão de Apólices</Title>
                <StyledButton onClick={() => setIsWizardOpen(true)}>
                    <IconButton><FaPlus /></IconButton> Nova Apólice
                </StyledButton>
            </HeaderContainer>

            <ContentContainer>
                <KpiCardsApolices stats={stats} /> {/* ✅ KPIs */}
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
                <ApolicesTable
                    apolices={apolices}
                    setApolices={setApolices}
                    onEdit={async (apolice) => {
                        try {
                            const response = await api.get(`/apolices/${apolice.id}/`);
                            console.log("primeiro passo",response)
                            setEditingApolice(response.data); // agora é uma `ApoliceDetalhada`
                            setIsWizardOpen(true);
                        } catch (error) {
                            console.error("Erro ao carregar apólice para edição", error);
                            message.error("Erro ao carregar apólice.");
                        }
                    }}

                />
            </>

                {/*<ApolicesCharts stats={stats} /> /!* ✅ Gráficos analíticos *!/*/}
            {/* 🧩 Modal de Cadastro - Agora Drawer Tela Cheia */}
                <DrawerContainer
                    title={editingApolice ? "Editar Apólice" : "Cadastro de Apólice"}
                    placement="right"
                    closable={true}
                    onClose={handleWizardClose}
                    open={isWizardOpen}
                    width="100vw"
                    height="100vh"
                >
                    <ApoliceWizard
                        apolice={editingApolice} // 👈 passa a apólice para edição
                        onClose={handleWizardClose}
                    />
                </DrawerContainer>

            </ContentContainer>
        </ApolicesContainer>
    );
};

export default ApolicesPage;
