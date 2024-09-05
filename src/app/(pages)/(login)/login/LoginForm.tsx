'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '@/app/api/axios';
import { setUser, setToken } from '@/store/slices/authSlice';
import styles from './styles.module.css';
import Link from "next/link";
import Image from "next/image";
import LogoImag from '../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg';

const LoginForm = () => {
    const [username, setUsernameState] = useState('');
    const [password, setPasswordState] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/o/token/',
                {
                    grant_type: 'password',
                    username,
                    password,
                    client_id: clientId,
                    client_secret: clientSecret,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const { access_token: access, refresh_token: refresh } = response.data;
            dispatch(setToken({ access, refresh }));

            const userResponse = await api.get('/user_detail/', {
                headers: { Authorization: `Bearer ${access}` },
            });

            dispatch(setUser(userResponse.data));

            // Armazenando no local storage
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('user', JSON.stringify(userResponse.data));

            setMessage('Login bem-sucedido!');
            router.push('/dashboard');
        } catch (error) {
            setMessage('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
            console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}google/login/`;
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
            <div className={styles.social_login}>
                <button onClick={handleGoogleLogin} className={styles.googleButton}>
                    Entrar com Google
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
