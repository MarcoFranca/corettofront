'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Adicione o usePathname
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css';
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import ClientDashboardSidebar from "@/app/components/common/Header/ClientDashboardSidebar";
import api from "@/app/api/axios";
import {RootState} from "@/store";
import {useMediaQuery} from "@/services/hooks/hooks";
import MenuMobile from "@/app/components/common/Header/DashboardMobile/MenuMobile";
import {setTokenFromLocalStorage, setUserFromLocalStorage} from "@/store/slices/authSlice";
import { logout } from "@/store/slices/authSlice";
import ThemeToggle from "@/app/components/ui/Button/ThemeToggle";
import RouteChangeLoader from "@/app/components/ui/loading/RouteChangeLoader";
import {setRouteLoading} from "@/store/slices/uiSlice";

interface DashboardLayoutProps {
    children: React.ReactNode;
}


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname(); // Obtemos a URL atual
    const [loading, setLoading] = useState(true);
    const [planoAtivo, setPlanoAtivo] = useState<boolean>(true);
    const [profileImage, setProfileImage] = useState<string>('');
    const [message, setMessage] = useState('');
    const isDesktop = useMediaQuery('(min-width: 768px)');


    const user = useSelector((state: RootState) => state.auth?.user);
    const token = useSelector((state: RootState) => state.auth?.token);

    // Lógica para decidir qual sidebar exibir
    const isClientPage = pathname?.startsWith('/dashboard/cliente/');
    const SidebarComponent = isClientPage ? ClientDashboardSidebar : DashboardSidebar;



    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
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
                const { profile } = response.data;
                const imageUrl = profile.image;
                const planoStatus = profile.assinatura_status;
                const isPlanoAtivo = planoStatus === 'active' || planoStatus === 'trialing';

                if (imageUrl) {
                    setProfileImage(imageUrl);
                    localStorage.setItem('profileImage', imageUrl);
                }

                setPlanoAtivo(isPlanoAtivo);

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(setRouteLoading(false));
        }, 300); // 👈 força 300ms de loading mínimo

        return () => clearTimeout(timeout);
    }, [pathname, dispatch]);


    const renderSidebar = () => (
        <SidebarComponent profileImage={profileImage} />
    );

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
                        {renderSidebar()}
                        <div className={styles.canvaLayout}>{children}</div>
                    </div>
                    <RouteChangeLoader />
                </main>
            );
        }

        return (
            <main className={styles.dashboardLayout}>
                <div className={styles.dashboardLayoutContaint}>
                    <div className={styles.themeToggle}>
                        <ThemeToggle/>
                    </div>

                    {renderSidebar()}
                    <div className={styles.canvaLayout}>{children}</div>
                </div>
                <RouteChangeLoader />
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
            <RouteChangeLoader />
        </main>
    );
};

export default DashboardLayout;
