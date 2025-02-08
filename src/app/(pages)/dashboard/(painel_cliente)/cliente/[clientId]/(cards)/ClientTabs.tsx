import React from "react";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import styles from '../(CustomerComponents)/ClientProfile.module.css';
import HealthInfoCard from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/HealthInfoCard";
import ApolicesTable from "@/app/components/cliente/apoliceClient/ApolicesTable";
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

const ClientTabs: React.FC<ClientTabsProps> = ({ cliente, financeData }) => {
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
                <ApolicesTable />
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
