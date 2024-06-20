'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios, { AxiosError } from 'axios';  // Import AxiosError
import api from '@/app/api/axios';
import { setUser, setToken } from '@/store/slices/authSlice';
import styles from './styles.module.css';
import Link from "next/link";
import Image from "next/image";
import LogoImag from '@/../public/assets/Ativo 2.png';

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
            if (axios.isAxiosError(error)) {
                setMessage('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
            } else {
                setMessage('Ocorreu um erro. Tente novamente mais tarde.');
            }
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div className={styles.container_form}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Image src={LogoImag} alt={'logotipo'} className={styles.image}/>
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
                <button type="submit" className={styles.button}>Entrar</button>
                <Link href={'/reset-password'} className={styles.sword}>Esqueceu a senha?</Link>
                {message && <p className={styles.message}>{message}</p>}
            </form>
            <div className={styles.cadastre}>
                <p>Não tem conta?<Link href={'/register'}> Cadastre-se</Link></p>
            </div>
        </div>
    );
};

export default LoginForm;
