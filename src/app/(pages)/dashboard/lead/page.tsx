'use client';

import styles from './styles.module.css';
import LeadBoard from "@/app/components/leadBoard/LeadBoard";
import DashboardLayout from "@/app/components/layouts/DashboardLayout";

const LeadPage = () => {

    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout>
                    <LeadBoard/>
            </DashboardLayout>
        </main>
    );
};

export default LeadPage;
