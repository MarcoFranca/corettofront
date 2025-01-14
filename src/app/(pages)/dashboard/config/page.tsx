'use client';

import styles from './styles.module.css';
import LeadBoard from "@/app/components/leadBoard/LeadBoard";
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import api from "@/app/api/axios";

const LeadPage = () => {
    // Define explicit types for the parameter
    const handleLinkGoogleAccount = async (googleToken: string) => {
        try {
            const response = await api.post('/google/link-google-account/', {
                googleToken: googleToken,
            });
            alert('Conta Google vinculada com sucesso!');
            console.log(response.data);
        } catch (error: unknown) {
            // Explicitly handle 'error' as an instance of Error or use generic handling
            if (axios.isAxiosError(error)) {
                console.error('Erro ao vincular conta Google:', error.response?.data || error.message);
                alert('Erro ao vincular conta Google.');
            } else {
                console.error('Erro desconhecido:', error);
                alert('Ocorreu um erro inesperado.');
            }
        }
    };

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code', // Define o fluxo como auth-code
        onSuccess: async (codeResponse) => {
            console.log('Authorization Code:', codeResponse.code);
            try {
                // Envie o código para o backend
                const response = await api.post('/google/link-google-account/', {
                    authorizationCode: codeResponse.code,
                });
                alert('Conta Google vinculada com sucesso!');
                console.log(response.data);
            } catch (error) {
                console.error('Erro ao vincular conta Google:', error);
                alert('Erro ao vincular conta Google.');
            }
        },
        onError: () => {
            alert('Erro ao autenticar com o Google.');
        },
    });


    return (
        <main className={styles.dashboardLayout}>
            <DashboardLayout>
                <h1>Tarefas</h1>
                <button className={styles.googleButton} onClick={() => loginWithGoogle()}>
                    Vincular Conta Google
                </button>
            </DashboardLayout>
        </main>
    );
};

export default LeadPage;
