'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import api from '@/app/api/axios';
import styles from './styles.module.css';

const DashboardPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');
        let userId = urlParams.get('user');

        if (!token || !userId) {
            // Se não houver token ou userId na URL, tenta pegar do localStorage
            token = localStorage.getItem('accessToken');
            const user = localStorage.getItem('user');
            if (user) {
                userId = JSON.parse(user).id;
            }
        }

        if (token && userId) {
            // Armazena o token no Redux
            dispatch(setToken({ access: token, refresh: '' }));

            // Busca os dados do usuário se ainda não estiver no Redux
            api.get(`/user_detail/`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(response => {
                dispatch(setUser(response.data));
                setLoading(false);  // Dados carregados com sucesso
            }).catch(error => {
                console.error('Erro ao carregar dados do usuário:', error);
                setLoading(false);  // Erro ao carregar os dados, mas ainda assim finalize o carregamento
                router.push('/');  // Redireciona para a página de login em caso de erro
            });
        } else {
            setLoading(false);  // Sem token ou userId na URL ou no localStorage
            router.push('/');  // Redireciona para a página de login se não houver token ou userId
        }
    }, [dispatch, router]);

    if (loading) {
        return <div>Carregando...</div>;  // Mostra um indicador de carregamento enquanto os dados estão sendo carregados
    }

    return (
        <main className={styles.dashboardLayout}>
                <div>Conteúdo do Dashboard</div>
        </main>
    );
};

export default DashboardPage;
