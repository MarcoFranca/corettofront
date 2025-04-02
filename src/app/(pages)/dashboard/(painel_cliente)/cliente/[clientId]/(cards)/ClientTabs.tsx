import React, {useEffect, useState} from "react";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import styles from '../(CustomerComponents)/ClientProfile.module.css';
import HealthInfoCard from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/HealthInfoCard";
import ApolicesTable from "../apolice/(component)/ApoliceTable";
import OpportunitiesTable from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/reuniao/OpportunitiesTable";
import Card from "@/app/components/common/Card";
import {Bar} from "react-chartjs-2";
import DocumentsFolder
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(documents)/DocumentsFolder";

interface ClientTabsProps {
    cliente: any; // Ajuste o tipo conforme necessário
    financeData: any; // Dados para o gráfico
}

import {
    FaHeartbeat,
    FaBox,
    FaMoneyBillWave,
    FaFolderOpen,
} from "react-icons/fa";
import { MdInsights, MdReportProblem } from "react-icons/md";
import {
    ApoliceConsorcio,
    ApoliceDetalhada,
    ApolicePlanoSaude,
    ApolicePrevidencia,
    ApolicesAgrupadas,
    ApoliceSeguroVida
} from "@/types/ApolicesInterface";
import {useParams} from "next/navigation";
import api from "@/app/api/axios";
import {
    ProdutoContainer
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceTable.styles";

const ClientTabs: React.FC<ClientTabsProps> = ({ cliente, financeData }) => {
    const { clientId } = useParams();
    const [apolices, setApolices] = useState<ApoliceDetalhada[]>([]);
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [visaoGeral, setVisaoGeral] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


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
        <Tabs>
            <TabList className={styles.tabList}>
                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                    <FaHeartbeat /> Saúde
                </Tab>
                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                    <FaBox /> Produtos
                </Tab>
                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                    <FaMoneyBillWave /> Finanças
                </Tab>
                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                    <MdInsights /> Oportunidades
                </Tab>
                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                    <FaFolderOpen /> Documentos
                </Tab>
                <Tab className={styles.tab} selectedClassName={styles.tabSelected}>
                    <MdReportProblem /> Sinistro
                </Tab>
            </TabList>

            <TabPanel>
                <HealthInfoCard cliente={cliente} />
            </TabPanel>
            <TabPanel>
                <Card title="Produtos">
                    <ApolicesTable
                        setApolices={setApolices}
                        apolices={apolices}
                        onEdit={() => {}} // função vazia só pra satisfazer o tipo
                    />
                </Card>
            </TabPanel>
            <TabPanel>
                <Card title="Informações Financeiras">
                    <Bar data={financeData} />
                </Card>
            </TabPanel>
            <TabPanel>
                <OpportunitiesTable cliente={cliente} />
            </TabPanel>
            <TabPanel>
                <DocumentsFolder cliente={cliente} />
            </TabPanel>
        </Tabs>
    );
};

export default ClientTabs;
