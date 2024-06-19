'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import DashboardHeader from "@/app/components/common/Header/NavBarDashboard";
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';
import LeadBoard from "@/app/components/leadBoard/LeadBoard";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

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
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (user && token) {
            dispatch(setUser(JSON.parse(user)));
            dispatch(setToken(JSON.parse(token)));
            setLoading(false);
        } else {
            router.push('/');
        }
    }, [dispatch, router]);

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
