'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUserFromLocalStorage, setTokenFromLocalStorage } from '@/store/slices/authSlice';
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';
import api from '@/app/api/axios';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [planoAtivo, setPlanoAtivo] = useState<boolean>(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const user = useSelector((state: RootState) => state.auth?.user);
    const token = useSelector((state: RootState) => state.auth?.token);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const accessToken = localStorage.getItem('accessToken');
            const storedProfileImage = localStorage.getItem('profileImage');

            if (accessToken) {
                dispatch(setUserFromLocalStorage());
                dispatch(setTokenFromLocalStorage());
            } else {
                router.push('/');
            }

            if (storedProfileImage) {
                setProfileImage(storedProfileImage);
            }
        }
    }, [dispatch, router]);

    useEffect(() => {
        async function fetchProfileAndPlanStatus() {
            try {
                const response = await api.get('/profiles/me/');
                const imageUrl = response.data.image;
                const planoAtivo = response.data.assinatura_status === 'active' || response.data.assinatura_status === 'trialing';

                if (imageUrl) {
                    setProfileImage(imageUrl);
                    localStorage.setItem('profileImage', imageUrl);
                }

                if (!planoAtivo) {
                    setPlanoAtivo(false);
                    setMessage('Seu plano está inativo. Por favor, escolha um plano para continuar.');
                    router.push('/dashboard/perfil/');
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar o perfil ou status do plano:', error);
                setLoading(false);
            }
        }

        fetchProfileAndPlanStatus();
    }, [router]);

    useEffect(() => {
        if (!loading && (!user || !token?.access)) {
            router.push('/');
        }
    }, [user, token, loading, router]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!planoAtivo) {
        return (
            <main className={styles.dashboardLayout}>
                <div className={styles.notificationBar}>
                    <div className={styles.notificationBarContent}>
                        <h1 className={styles.notificationBarText}>{message}</h1>
                        <button
                            className={styles.notificationBarButton}
                            onClick={() => router.push('/planos')}
                            disabled={loading}
                        >
                            Escolher seu Plano
                        </button>
                    </div>
                </div>
                <div className={styles.dashboardLayoutContaint}>
                    <DashboardSidebar profileImage={profileImage} />
                    <div className={styles.canvaLayout}>{children}</div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.dashboardLayout}>
            <div className={styles.dashboardLayoutContaint}>
                <DashboardSidebar profileImage={profileImage} />
                <div className={styles.canvaLayout}>{children}</div>
            </div>
        </main>
    );
};

export default DashboardLayout;
