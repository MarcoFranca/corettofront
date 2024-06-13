'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout, setUserFromLocalStorage } from '@/store/slices/authSlice';
import DashboardHeader from "@/app/components/common/Header/NavBarDashboard";
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        dispatch(setUserFromLocalStorage());
    }, [dispatch]);

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) {
        return null; // Ou um indicador de carregamento
    }

    return (
        <div className={styles.dashboardLayout}>
            <DashboardHeader />
            <DashboardSidebar />
            <main className={styles.mainContent}>
                <h1>Bem-vindo, {user.username}</h1>
                {/* Adicione aqui os componentes e funcionalidades do dashboard */}
            </main>
        </div>
    );
};

export default DashboardPage;
