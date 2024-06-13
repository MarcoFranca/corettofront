'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '../../api/axios';
import { setUser, setToken } from '@/store/slices/authSlice';
import styles from './styles.module.css';
import Link from "next/link";

const LoginForm = () => {
    const [username, setUsernameState] = useState('');
    const [password, setPasswordState] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/token/', {
                username,
                password,
            });

            const { access, refresh } = response.data;
            dispatch(setToken({ access, refresh }));

            const userResponse = await api.get('/user_detail/', {
                headers: { Authorization: `Bearer ${access}` },
            });

            dispatch(setUser(userResponse.data));
            setMessage('Login bem-sucedido!');
            router.push('/dashboard');
        } catch (error) {
            setMessage('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="Nome de Usuário"
                value={username}
                onChange={(e) => setUsernameState(e.target.value)}
                className={styles.input}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPasswordState(e.target.value)}
                className={styles.input}
                required
            />
            <button type="submit" className={styles.button}>Login</button>
            <Link href={'/register'}>Já tem cadastro? Clique aqui!</Link>
            {message && <p className={styles.message}>{message}</p>}
        </form>
    );
};

export default LoginForm;
