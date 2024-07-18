'use client';

import styles from './styles.module.css';
import DashboardLayout from "@/app/components/layouts/DashboardLayout";

const LeadPage = () => {

    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout>
                <h1>Carteira</h1>
            </DashboardLayout>
        </main>
    );
};

export default LeadPage;
