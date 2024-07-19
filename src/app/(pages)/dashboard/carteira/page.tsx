'use client';

import styles from './styles.module.css';
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import ClientesTable from "@/app/components/carteira/ClientesTable";

const LeadPage = () => {

    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout>
                <ClientesTable/>
            </DashboardLayout>
        </main>
    );
};

export default LeadPage;
