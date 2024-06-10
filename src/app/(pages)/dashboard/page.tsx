'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import {Header} from "@/app/components/common/Header";
import {logout} from "@/app/utils/auth";

interface User {
    id: number;
    username: string;
    email: string;
    token: {
        refresh: string;
        access: string;
    };
}

const DashboardPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) {
        return null; // Ou um indicador de carregamento
    }

    return (
        <>
            <Header/>
            <div className={styles.container}>
                <h1>Bem-vindo, {user.username}</h1>
                {/* Adicione aqui os componentes e funcionalidades do dashboard */}
                <button onClick={handleLogout} className={styles.buttonLogout}>
                    Logout
                </button>
            </div>
        </>
    );
};

export default DashboardPage;
