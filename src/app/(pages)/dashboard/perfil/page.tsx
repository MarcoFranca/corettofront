'use client';

import styles from './styles.module.css';
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import ProfilePage from "@/app/components/users/PERFIL/page";

const PerfilPage = () => {

    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout>
                <ProfilePage/>
            </DashboardLayout>
        </main>
    );
};

export default PerfilPage;
