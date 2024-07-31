'use client';

import styles from './styles.module.css';
import LeadBoard from "@/app/components/leadBoard/LeadBoard";
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import Agenda from "@/app/components/agenda/Agenda";

const AgendaPage = () => {

    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout>
                <Agenda />
            </DashboardLayout>
        </main>
    );
};

export default AgendaPage;
