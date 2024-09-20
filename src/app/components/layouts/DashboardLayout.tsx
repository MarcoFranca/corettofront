'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUserFromLocalStorage } from '@/store/slices/authSlice';
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';
import api from "@/app/api/axios";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado inicial de loading
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

    // Carrega o usuário e o token do LocalStorage quando o componente é montado
    useEffect(() => {
        dispatch(setUserFromLocalStorage());
    }, [dispatch]);

    // Verifica se o usuário e o token foram carregados corretamente após o estado do Redux ter sido atualizado
    useEffect(() => {
        console.log("Verificando user e token...");
        if (!loading && (!user || !token?.access)) {
            console.log("Redirecionando para a home...");
            router.push('/');
        } else if (user && token?.access) {
            console.log("Usuário autenticado, prosseguindo...");
            setLoading(false);
        }
    }, [user, token, router, loading]);

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

    // Exibe o indicador de carregamento até que os dados estejam prontos
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
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
                <DashboardSidebar />
                <div className={styles.canvaLayout}>{children}</div>
            </div>
        </main>
    );
};

export default DashboardLayout;
