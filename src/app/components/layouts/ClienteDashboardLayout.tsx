'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUserFromLocalStorage } from '@/store/slices/authSlice';
import DashboardSidebar from "@/app/components/common/Header/ClientDashboard";
import styles from './styles.module.css';
import api from "@/app/api/axios";

interface DashboardLayoutProps {
    children: React.ReactNode;
    clientId: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, clientId }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const [profile, setProfile] = useState<{
        first_name: string;
        last_name: string;
        foto: string | File;
        assinatura_status: string;
        plano?: {
            nome: string;
            descricao: string;
            preco: string;
        } | null; // Adicionando o plano ao estado
    }>({
        first_name: '',
        last_name: '',
        foto: '',
        assinatura_status: 'pendente',
        plano: null,
    });

    const assinaturaStatus = () => {
        return profile.assinatura_status !== 'active';
    };

    useEffect(() => {
        dispatch(setUserFromLocalStorage());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (loading) return; // Aguarda a finalização do carregamento
        if (!user || !token?.access) {
            router.push('/');
        }
    }, [user, token, router]);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get('/profiles/me/');
                setProfile({
                    ...response.data,
                    first_name: response.data.user.first_name,
                    last_name: response.data.user.last_name,
                    isAccountActive: response.data.user.is_active,
                    plano: response.data.plano, // Definindo o plano
                });
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            }
        }
        fetchProfile();
    }, []);

    if (loading) {
        return <div>Carregando...</div>; // Ou qualquer indicador de carregamento
    }

    return (
        <main className={styles.dashboardLayout}>
            {/*Tarja de Status da Conta*/}
            {assinaturaStatus() && (
                <div className={styles.notificationBar}>
                    <div className={styles.notificationBarContent}>
                        <p className={styles.notificationBarText}>Sua conta está inativa.</p>
                        <button className={styles.notificationBarButton} onClick={() => router.push('/planos')}>Escolher
                            seu Plano
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.dashboardLayoutContaint}>
                <DashboardSidebar clientId={clientId}/>
                <div className={styles.canvaLayout}>{children}</div>
            </div>
        </main>
);
};

export default DashboardLayout;
