'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css';
import {RootState} from "@/store";
import {logout, setTokenFromLocalStorage, setUserFromLocalStorage} from "@/store/slices/authSlice";
import api from "@/app/api/axios";
import {useMediaQuery} from "@/services/hooks/hooks";
import Spinner from "@/app/components/ui/loading/spinner/sppiner";
import MenuMobile from "@/app/components/common/Header/DashboardMobile/MenuMobile";

interface DashboardLayoutProps {
    children: React.ReactNode;
    SidebarComponent: React.FC<any>; // Componente de sidebar dinâmico
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, SidebarComponent }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [planoAtivo, setPlanoAtivo] = useState<boolean>(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [isSubUser, setIsSubUser] = useState<boolean>(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const user = useSelector((state: RootState) => state.auth?.user);
    const token = useSelector((state: RootState) => state.auth?.token);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

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
                const { profile, subuser } = response.data;
                const imageUrl = profile.image;
                const planoStatus = profile.assinatura_status;
                const isPlanoAtivo = planoStatus === 'active' || planoStatus === 'trialing';

                if (imageUrl) {
                    setProfileImage(imageUrl);
                    localStorage.setItem('profileImage', imageUrl);
                }

                setPlanoAtivo(isPlanoAtivo);
                setIsSubUser(!!subuser);

                if (!isPlanoAtivo) {
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



    if (isDesktop) {
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
                        <SidebarComponent profileImage={profileImage} />
                        <div className={styles.canvaLayout}>{children}</div>
                    </div>
                </main>
            );
        }
        return (
            <main className={styles.dashboardLayout}>
                <div className={styles.dashboardLayoutContaint}>
                    <SidebarComponent profileImage={profileImage} />
                    <div className={styles.canvaLayout}>{children}</div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.dashboardLayoutMobile}>
            <div className={styles.dashboardLayoutContaintMobile}>
                <MenuMobile
                    profileImage={profileImage}
                    user={user}
                    onLogout={handleLogout}
                />
                <div className={styles.canvaLayoutMobile}>{children}</div>
            </div>
        </main>
    );
};

export default DashboardLayout;
