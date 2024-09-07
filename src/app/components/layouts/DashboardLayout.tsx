'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUserFromLocalStorage } from '@/store/slices/authSlice';
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado inicial de loading
    const [isLoaded, setIsLoaded] = useState(false); // Variável para garantir que o Redux atualizou
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);

    // Carrega o usuário e o token do LocalStorage quando o componente é montado
    useEffect(() => {
        dispatch(setUserFromLocalStorage());
        setIsLoaded(true); // Marcamos como "carregado" após despachar a ação
    }, [dispatch]);

    // Verifica se o usuário e o token foram carregados corretamente após o estado do Redux ter sido atualizado
    useEffect(() => {
        if (isLoaded) {
            if (user && token?.access) {
                setLoading(false); // O carregamento termina quando o usuário e o token são encontrados
            } else if (user === null || token === null) {
                setLoading(false); // Também termina o carregamento se o usuário e o token estiverem ausentes
                router.push('/'); // Redireciona se não houver usuário ou token
            }
        }
    }, [user, token, isLoaded, router]);

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
            <DashboardSidebar />
            <div className={styles.canvaLayout}>{children}</div>
        </main>
    );
};

export default DashboardLayout;
