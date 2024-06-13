// src/app/pages/reset-password/page.tsx
'use client';

import { useState } from 'react';
import api from '../../api/axios';
import styles from './styles.module.css';
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/password_reset/', { email });

            setMessage('Se um usuário com esse e-mail existir, um link de redefinição de senha será enviado.');
        } catch (error) {
            setMessage('Erro ao solicitar redefinição de senha. Tente novamente.');
            console.error('Erro ao solicitar redefinição de senha:', error);
        }
    };

    return (
        <>
            <SimpleNavBar/>
        <div className={styles.container}>
            <h1>Recuperar Senha</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Enviar Link de Redefinição</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
        </>
    );
};

export default ResetPasswordPage;
