import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { AppDispatch, RootState } from '@/store';
import {
    fetchLinkedGoogleAccount,
    linkGoogleAccount,
    unlinkGoogleAccount,
    clearMessages,
} from '@/store/slices/googleIntegrationSlice';
import styles from './GoogleAccountSettings.module.css';
import Image from "next/image";
import GoogleImag from "../../../../../public/assets/common/GoogleIcon.svg";

const GoogleAccountSettings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Correção do seletor
    const { linkedAccount, error, message, status } = useSelector((state: RootState) => state.googleIntegration);

    useEffect(() => {
        dispatch(fetchLinkedGoogleAccount());
    }, [dispatch]);

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (codeResponse) => {
            dispatch(linkGoogleAccount(codeResponse.code));
        },
        onError: () => {
            dispatch(clearMessages());
        },
    });

    return (
        <div className={styles.container}>
            <div className={styles.headerCard}>
                <Image src={GoogleImag} alt={'Logo Google'} className={styles.logoGoogle}></Image>
                <h2 className={styles.title}>Conta do Google</h2>
            </div>
            {status === 'loading' && <p>🔄 Carregando...</p>}
            {linkedAccount ? (
                <>
                    <div className={styles.cardContant}>
                        <div className={styles.accountInfo}>
                            <p><strong>🔗 Conta Vinculada:</strong> {linkedAccount.email}</p>
                            <p><strong>📅 Vinculada em:</strong> {new Date(linkedAccount.created_at).toLocaleString()}</p>
                            <p>
                                ⏳<strong> Expira em:</strong>{' '}
                                {linkedAccount.expiry
                                    ? new Date(linkedAccount.expiry).toLocaleString()
                                    : 'Data de expiração não disponível'}
                            </p>
                            <div className={styles.buttons}>
                                <button className={styles.googleButton} onClick={() => loginWithGoogle()}>
                                    🔄️ Alterar Conta Google
                                </button>
                                <button className={styles.unlinkButton} onClick={() => dispatch(unlinkGoogleAccount())}>
                                    ⛓️‍💥 Desvincular Conta Google
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (

                <div className={styles.cardContant}>
                    <div className={styles.accountInfo}>
                        <p>🔗 Nenhuma conta vinculada.</p>
                        <p>Clique abaixo para vincular 👇</p>
                        <button onClick={() => loginWithGoogle()} className={styles.googleButton}>
                            🔗 Vincular Conta Google
                        </button>
                    {error && <p className={styles.error}>{error}</p>}
                    {message && <p className={styles.success}>{message}</p>}
                    </div>
                </div>

            )}
        </div>
    );
};

export default GoogleAccountSettings;
