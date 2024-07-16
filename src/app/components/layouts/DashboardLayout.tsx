'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUserFromLocalStorage } from '@/store/slices/authSlice';
import DashboardHeader from "@/app/components/common/Header/NavBarDashboard";
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);

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
            <DashboardSidebar />
            <div className={styles.canvaLayout}>{children}</div>
        </main>
    );
};

export default DashboardLayout;
