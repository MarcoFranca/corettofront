'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '@/app/api/axios';
import { setUser, setToken } from '@/store/slices/authSlice';
import styles from './styles.module.css';
import Link from "next/link";
import Image from "next/image";
import LogoImag from '../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg';
import GoogleImag from '../../../../../public/assets/common/GoogleIcon.svg';
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsernameState] = useState('');
    const [password, setPasswordState] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Inicia o carregamento
        setMessage(''); // Limpa mensagens anteriores

        try {
            const response = await api.post('/login/',{
                    username,
                    password
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

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('user', JSON.stringify(userResponse.data));

            setMessage('Login bem-sucedido!');
            router.push('/dashboard/perfil');
        } catch (error) {
            setMessage('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
            if (axios.isAxiosError(error)) {
                console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
            } else {
                console.error('Erro inesperado ao fazer login:', error);
            }
        } finally {
            setLoading(false); // Encerra o carregamento
        }
    };

    const handleGoogleLogin = () => {
        const redirectUri = `${process.env.NEXT_PUBLIC_API_BASE_URL}/google/callback/`;
        const scope = [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ].join(' ');

        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/google/login/?scope=${scope}&redirect_uri=${redirectUri}`;
    };

    const handleGoogleCallback = async () => {
        const params = new URLSearchParams(window.location.search);
        const authCode = params.get('code');
        if (authCode) {
            try {
                const response = await api.post('/google/callback/', { code: authCode }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const { token, user, refresh_token } = response.data;

                dispatch(setToken({ access: token, refresh: refresh_token || '' }));
                localStorage.setItem('accessToken', token);
                if (refresh_token) {
                    localStorage.setItem('refreshToken', refresh_token);
                }
                localStorage.setItem('user', JSON.stringify(user));

                router.push('/dashboard');
            } catch (error) {
                console.error('Erro ao fazer login com Google:', error);
                setMessage('Erro ao fazer login com Google.');
            }
        }
    };

    React.useEffect(() => {
        if (window.location.search.includes('code')) {
            handleGoogleCallback();
        }
    }, []);

    return (
        <div className={styles.container_form}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Image src={LogoImag} alt={'logotipo'} className={styles.image} />
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
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                    {loading && <div className={styles.spinner}></div>}
                </button>
                {message && <p className={styles.message}>{message}</p>}
                <div className={styles.lineContainer}>
                    <div className={styles.line} />
                    <p>ou</p>
                    <div className={styles.line} />
                </div>
                <div className={styles.social_login}>
                    <button onClick={handleGoogleLogin} className={styles.googleButton}>
                        <Image src={GoogleImag} alt={'google Icon'} className={styles.social_image} />
                        Entrar com Google
                    </button>
                </div>
                <Link href={'/reset-password'} className={styles.sword}>Esqueceu a senha?</Link>
            </form>
            <div className={styles.cadastre}>
                <p>Não tem conta?<Link href={'/register'}> Cadastre-se</Link></p>
            </div>
        </div>
    );
};

export default LoginForm;
