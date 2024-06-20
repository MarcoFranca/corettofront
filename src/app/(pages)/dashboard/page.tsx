'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUserFromLocalStorage } from '@/store/slices/authSlice';
import DashboardHeader from "@/app/components/common/Header/NavBarDashboard";
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';
import LeadBoard from "@/app/components/leadBoard/LeadBoard";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <h1>{"Bem - vindo!"}</h1>;
            case 'leads':
                return <LeadBoard />;
            case 'clients':
                return <div>Conteúdo de Clientes</div>;
            default:
                return <div>Conteúdo do Dashboard</div>;
        }
    };

    useEffect(() => {
        dispatch(setUserFromLocalStorage());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (loading) return; // Aguarda a finalização do carregamento
        if (!user || !token?.access || !token?.refresh) {
            router.push('/');
        }
    }, [user, token, router]);

    if (loading) {
        return <div>Carregando...</div>; // Ou qualquer indicador de carregamento
    }

    return (
        <main className={styles.dashboardLayout}>
            <DashboardSidebar setActiveTab={setActiveTab} />
            <section className={styles.canvaLayout}>
                <DashboardHeader />
                <main className={styles.mainContent}>
                    {renderContent()}
                </main>
            </section>
        </main>
    );
};

export default DashboardPage;
