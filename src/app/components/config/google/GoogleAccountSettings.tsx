import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from "@/app/api/axios";
import styles from './GoogleAccountSettings.module.css';

const GoogleAccountSettings: React.FC = () => {
    const [linkedAccount, setLinkedAccount] = useState<{ email: string; created_at: string } | null>(null);

    // Função para buscar informações da conta vinculada
    const fetchLinkedAccount = async () => {
        try {
            const response = await api.get('/google/credentials/');
            setLinkedAccount(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar conta vinculada:', error);
            setLinkedAccount(null);
        }
    };

    useEffect(() => {
        fetchLinkedAccount();
    }, []);

    const handleLinkGoogleAccount = async (authorizationCode: string) => {
        try {
            const response = await api.post('/google/link-google-account/', { authorizationCode });
            alert('Conta Google vinculada com sucesso!');
            fetchLinkedAccount(); // Atualiza as informações após vincular
        } catch (error) {
            console.error('Erro ao vincular conta Google:', error);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            await handleLinkGoogleAccount(codeResponse.code);
        },
        onError: () => {
            alert('Erro ao autenticar com o Google.');
        },
    });

    const handleUnlinkGoogleAccount = async () => {
        try {
            const response = await api.post('/google/unlink-google-account/');
            alert(response.data.success || '🎉 Conta Google desvinculada com sucesso!');
            setLinkedAccount(null); // Remove as informações da conta vinculada
        } catch (error) {
            console.error('Erro ao desvincular conta Google:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Configurações de Conta Google</h2>
            {linkedAccount ? (
                <>
                    <div className={styles.accountInfo}>
                        <p><strong>Conta Vinculada:</strong> {linkedAccount.email}</p>
                        <p><strong>Vinculada em:</strong> {new Date(linkedAccount.created_at).toLocaleString()}</p>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.googleButton} onClick={() => loginWithGoogle()}>
                            {linkedAccount ? 'Alterar Conta Google' : 'Vincular Conta Google'}
                        </button>
                        <button className={styles.unlinkButton} onClick={handleUnlinkGoogleAccount}>
                            Desvincular Conta Google
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p>🔗 Nenhuma conta vinculada.</p>
                    <button className={styles.googleButton} onClick={() => loginWithGoogle()}>
                        {linkedAccount ? 'Alterar Conta Google' : 'Vincular Conta Google'}
                    </button>
                </>
            )}
        </div>
    );
};

export default GoogleAccountSettings;
