'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUserFromLocalStorage, setTokenFromLocalStorage } from '@/store/slices/authSlice';
import DashboardSidebar from "@/app/components/common/Header/DashboardSidebar";
import styles from './styles.module.css';
import api from '@/app/api/axios';  // Importando o API para buscar a imagem

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const user = useSelector((state: RootState) => state.auth?.user);
    const token = useSelector((state: RootState) => state.auth?.token);
    const [profileImage, setProfileImage] = useState<string | null>(null); // Inicialmente nulo

    // Função para carregar os dados do localStorage e atualizar o Redux
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

            // Configura a imagem de perfil
            if (storedProfileImage) {
                setProfileImage(storedProfileImage);
            }

            setLoading(false);
        }
    }, [dispatch, router]);

    // Função para carregar a imagem de perfil se ela não estiver no localStorage
    useEffect(() => {
        async function fetchProfileImage() {
            try {
                const response = await api.get('/profiles/me/');
                const imageUrl = response.data.image;
                if (imageUrl) {
                    setProfileImage(imageUrl);
                    if (typeof window !== "undefined") {
                        localStorage.setItem('profileImage', imageUrl); // Armazena no localStorage
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar a imagem de perfil:', error);
            }
        }

        if (!profileImage) {
            fetchProfileImage();
        }
    }, [profileImage]);

    // Verifica a autenticação quando o estado muda
    useEffect(() => {
        if (!loading && (!user || !token?.access)) {
            router.push('/');
        }
    }, [user, token, loading, router]);

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
            <div className={styles.dashboardLayoutContaint}>
                <DashboardSidebar profileImage={profileImage} />
                <div className={styles.canvaLayout}>{children}</div>
            </div>
        </main>
    );
};

export default DashboardLayout;
