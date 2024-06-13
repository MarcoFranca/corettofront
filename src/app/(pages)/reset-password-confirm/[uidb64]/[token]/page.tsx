// src/app/reset-password-confirm/[uidb64]/[token]/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import api from '../../../../api/axios';
import styles from './styles.module.css';

const ResetPasswordConfirmPage = () => {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post(`/password_reset_confirm/${uidb64}/${token}/`, { password: newPassword });

            setMessage('Senha redefinida com sucesso!');
            router.push('/login');
        } catch (error) {
            setMessage('Erro ao redefinir senha. Tente novamente.');
            console.error('Erro ao redefinir senha:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Redefinir Senha</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="password"
                    placeholder="Nova Senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Redefinir Senha</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default ResetPasswordConfirmPage;
