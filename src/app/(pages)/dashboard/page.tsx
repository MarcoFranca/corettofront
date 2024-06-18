'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import DashboardHeader from "@/app/components/common/Header/NavBarDashboard";
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

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
        <div className={styles.dashboardLayout}>
            <DashboardSidebar />
            <div className={styles.canva}>
                <DashboardHeader />
                <main className={styles.mainContent}>
                    <h1>{"Bem - vindo!" }</h1>
                    {/* Adicione aqui os componentes e funcionalidades do dashboard */}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
