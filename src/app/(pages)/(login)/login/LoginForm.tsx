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
import GoogleImag from '../../../../../public/assets/common/GoogleIcon.svg';

const LoginForm = () => {
    const [username, setUsernameState] = useState('');
    const [password, setPasswordState] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/login/', { username, password });
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
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await api.get('/integrations/google/login/');
            const { auth_url, state } = response.data;

            localStorage.setItem("oauth_state", state);
            window.location.href = auth_url;
        } catch (error) {
            setMessage('Erro ao conectar com o Google. Tente novamente mais tarde.');
        }
    };

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
