// src/app/pages/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/axios';
import styles from './styles.module.css';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setMessage('Você precisa estar logado para alterar a senha.');
                return;
            }

            const response = await api.post('/change_password/', {
                old_password: currentPassword,
                new_password: newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setMessage('Senha alterada com sucesso!');
            router.push('/dashboard');
        } catch (error) {
            setMessage('Erro ao alterar senha. Verifique suas credenciais e tente novamente.');
            console.error('Erro ao alterar senha:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Alterar Senha</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="password"
                    placeholder="Senha Atual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Nova Senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Alterar Senha</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default ChangePasswordPage;
