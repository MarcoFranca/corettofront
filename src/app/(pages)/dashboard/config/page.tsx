'use client';

import React from 'react';
import styles from './styles.module.css';
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import GoogleAccountSettings from "@/app/components/config/google/GoogleAccountSettings";

const UserSettings: React.FC = () => {
    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout>
                <div className={styles.container}>
                    <h1>⚙️ Configurações do Usuário</h1>
                    <GoogleAccountSettings />
                    {/* Adicione outros componentes de configuração aqui */}
                </div>
            </DashboardLayout>
        </main>
    );
};

export default UserSettings;
