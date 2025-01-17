import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from "@/app/api/axios";
import styles from './GoogleAccountSettings.module.css';

const GoogleAccountSettings: React.FC = () => {
    const [linkedAccount, setLinkedAccount] = useState<{ email: string; created_at: string; expiry:string } | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para mensagens de erro
    const [message, setMessage] = useState<string | null>(null); // Estado para mensagens de erro

    // Função para buscar informações da conta vinculada
    const fetchLinkedAccount = async () => {
        try {
            const response = await api.get('/google/credentials/');
            setLinkedAccount(response.data);
            setErrorMessage(null); // Limpa mensagens de erro ao carregar com sucesso
        } catch (error: any) {
            console.error('Erro ao buscar conta vinculada:', error);
            setLinkedAccount(null);
            setErrorMessage('⚠️ Não foi possível carregar as credenciais do Google. 🥺');
        }
    };

    useEffect(() => {
        fetchLinkedAccount();
    }, []);

    const handleLinkGoogleAccount = async (authorizationCode: string) => {
        try {
            await api.post('/google/link-google-account/', { authorizationCode });
            setMessage('🔗 Conta Google vinculada com sucesso! 🎉🥳');
            fetchLinkedAccount(); // Atualiza as informações após vincular
        } catch (error: any) {
            console.error('Erro ao vincular conta Google:', error);
            if (error.response && error.response.data) {
                const backendError = error.response.data;

                if (backendError.error === 'Conta já vinculada.') {
                    setErrorMessage(
                        '⚠️ ⛓️‍💥 Essa conta do Google já está vinculada a outro usuário.' +
                        ' Por favor, desvincule-a do outro usuário ou escolha outra conta. ⚠️'
                    );
                } else if (backendError.detail) {
                    setErrorMessage(backendError.detail);
                } else {
                    setErrorMessage('⚠️ Erro ao vincular conta Google. Tente novamente mais tarde.');
                }
            } else {
                setErrorMessage('⚠️ Erro inesperado ao vincular conta Google.');
            }
        }
    };

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                await handleLinkGoogleAccount(codeResponse.code);
            } catch (error) {
                console.error("Erro ao vincular conta Google:", error);
                setErrorMessage('⚠️ Erro ao vincular conta Google. Verifique os detalhes e tente novamente.');
            }
        },
        onError: () => {
            setErrorMessage('⚠️ Erro ao autenticar com o Google.');
        },
    });

    const handleUnlinkGoogleAccount = async () => {
        try {
            const response = await api.post('/google/unlink-google-account/');
            setErrorMessage(response.data.success || '⛓️‍💥 Conta Google desvinculada com sucesso! 😄');
            setLinkedAccount(null); // Remove as informações da conta vinculada
            setErrorMessage(null); // Limpa mensagens de erro após sucesso
        } catch (error) {
            console.error('Erro ao desvincular conta Google:', error);
            setErrorMessage('Erro ao desvincular conta Google. Tente novamente mais tarde.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Configurações de Conta Google</h2>

            {linkedAccount ? (
                <>
                    <div className={styles.accountInfo}>
                        <p><strong>🔗 Conta Vinculada:</strong> {linkedAccount.email}</p>
                        <p><strong>📅 Vinculada em:</strong> {new Date(linkedAccount.created_at).toLocaleString()}</p>
                        <p><strong>⏳ Expira em:</strong> {new Date(linkedAccount.expiry).toLocaleString()}</p>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.googleButton} onClick={() => loginWithGoogle()}>
                            🔄️ Alterar Conta Google
                        </button>
                        <button className={styles.unlinkButton} onClick={handleUnlinkGoogleAccount}>
                            ⛓️‍💥 Desvincular Conta Google
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p>Nenhuma conta vinculada.</p>
                    <p>Clique abaixo para vincular 👇</p>
                    <button className={styles.googleButton} onClick={() => loginWithGoogle()}>
                       🔗 Vincular Conta Google
                    </button>
                </>
            )}
            {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Exibe mensagens de erro */}
            {message && <p className={styles.success}>{message}</p>} {/* Exibe mensagens de erro */}
        </div>
    );
};

export default GoogleAccountSettings;
