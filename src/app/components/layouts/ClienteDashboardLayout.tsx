'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Adicione o usePathname
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css';
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import ClientDashboardSidebar from "@/app/components/common/Header/ClientDashboardSidebar";
import api from "@/app/api/axios";
import {AppDispatch, RootState} from "@/store";
import {useMediaQuery} from "@/services/hooks/hooks";
import MenuMobile from "@/app/components/common/Header/DashboardMobile/MenuMobile";
import {setTokenFromLocalStorage, setUserFromLocalStorage} from "@/store/slices/authSlice";
import { logout } from "@/store/slices/authSlice";
import ThemeToggle from "@/app/components/ui/Button/ThemeToggle";
import RouteChangeLoader from "@/app/components/ui/loading/RouteChangeLoader";
import {setRouteLoading} from "@/store/slices/uiSlice";
import CoraDrawer from "@/app/components/openai/CoraDrawer";
import {updateProfile} from "@/store/slices/profileSlice";
import {showTrialTokensModal} from "@/app/components/popup/trialToken";
import Lottie from 'react-lottie-player';
import coraAnimation from '@/../public/lotties/cora3.json';
import {fetchProfissoesThunk} from "@/store/slices/profissoesSlice";


interface DashboardLayoutProps {
    children: React.ReactNode;
}


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname(); // Obtemos a URL atual
    const [loading, setLoading] = useState(true);
    const [planoAtivo, setPlanoAtivo] = useState<boolean>(true);
    const [profileImage, setProfileImage] = useState<string>('');
    const [message, setMessage] = useState('');
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [profile, setProfile] = useState<any>(null);
    const [isTrialSemPlano, setIsTrialSemPlano] = useState(false);
    const [profileData, setProfileData] = useState<any>(null); // novo
    const [hideTrialBanner, setHideTrialBanner] = useState(false);
    const [coraVisible, setCoraVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasMouseLeft, setHasMouseLeft] = useState(false);
    const [animationKey, setAnimationKey] = useState(Math.random());

    const user = useSelector((state: RootState) => state.auth?.user);
    const token = useSelector((state: RootState) => state.auth?.token);

    // Lógica para decidir qual sidebar exibir
    const isClientPage = pathname?.startsWith('/dashboard/cliente/');
    const SidebarComponent = isClientPage ? ClientDashboardSidebar : DashboardSidebar;

    const handleMouseEnter = () => {
        setAnimationKey(Math.random()); // Reinicia do início
        setIsPlaying(true);
        setHasMouseLeft(false);
    };

    // Ao sair, só para após terminar
    const handleMouseLeave = () => {
        setHasMouseLeft(true);
    };

    const handleAnimationComplete = () => {
        if (hasMouseLeft) setIsPlaying(false);
    };

    useEffect(() => {
        if (!profile) return;

        const hasSeenTokensModal = localStorage.getItem('trialTokensModalSeen');

        const estaNoTrial = profile.assinatura_status === 'trialing';
        const temPlano = !!profile.plano;
        const tokensAindaNaoLiberados = !profile.trial_tokens_liberados;

        if (!hasSeenTokensModal && estaNoTrial && temPlano && tokensAindaNaoLiberados) {
            showTrialTokensModal();
        }
    }, [profile]);

    useEffect(() => {
        dispatch(fetchProfissoesThunk());
    }, [dispatch]);


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
                const profileData = response.data.profile;
                dispatch(updateProfile(profileData));

                const imageUrl = profileData.image;
                const planoStatus = profileData.assinatura_status;
                const isPlanoAtivo = planoStatus === 'active' || planoStatus === 'trialing';
                const isTrialSemPlanoStatus = planoStatus === 'trialing' && !profileData.plano;
                setProfileData(profileData); // aqui salvamos para o outro useEffect

                setProfile(profileData); // ✅ salva o profile
                setIsTrialSemPlano(isTrialSemPlanoStatus); // ✅ salva o status

                if (imageUrl) {
                    setProfileImage(imageUrl);
                    localStorage.setItem('profileImage', imageUrl);
                }

                setPlanoAtivo(isPlanoAtivo);

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar o perfil ou status do plano:', error);
                setLoading(false);
            }
        }

        fetchProfileAndPlanStatus();
    }, [pathname]);



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
                <button
                    className={styles.coraButtonLottie}
                    onClick={() => setCoraVisible(true)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    tabIndex={0}
                    aria-label="Abrir assistente Cora"
                >
                    <Lottie
                        key={animationKey}
                        loop={false}
                        animationData={coraAnimation}
                        play={isPlaying}
                        style={{width: 54, height: 54}}
                        onComplete={handleAnimationComplete}
                    />
                </button>

                <div className={styles.dashboardLayoutContaint}>
                    <div className={styles.themeToggle}>
                        <ThemeToggle/>
                    </div>

                    {renderSidebar()}
                    <div className={styles.canvaLayout}>
                        {isTrialSemPlano && !hideTrialBanner && (
                            <div className={styles.trialBanner}>
                                🎁 Você está usando o período gratuito. Escolha um plano para continuar aproveitando após
                                os 14 dias.
                                <button
                                    className={styles.notificationBarButton}
                                    onClick={() => router.push('/planos')}
                                >
                                    Escolher Plano
                                </button>
                                <span
                                    className={styles.trialBannerClose}
                                    onClick={() => setHideTrialBanner(true)}
                                >
            ×
        </span>
                            </div>
                        )}
                        {children}
                        <CoraDrawer open={coraVisible} onClose={() => setCoraVisible(false)}/>
                    </div>
                </div>
                <RouteChangeLoader/>
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
            <RouteChangeLoader/>
        </main>
    );
};

export default DashboardLayout;
