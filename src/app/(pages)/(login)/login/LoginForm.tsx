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
    import {toast} from "react-toastify";
    import {FaEye, FaEyeSlash} from "react-icons/fa";

const LoginForm = () => {
    const [username, setUsernameState] = useState('');
    const [password, setPasswordState] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            toast.success('🎉 Login realizado com sucesso! Redirecionando...');
            router.push('/dashboard/');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            if (error instanceof Error) {
                toast.error(`🚨 ${error.message}`);
            } else if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as any; // 👈 Type assertion
                if (axiosError.response && axiosError.response.data) {
                    toast.error(`🚨 ${Object.values(axiosError.response.data).join(' ')}`);
                } else {
                    toast.error('Erro ao fazer login. Verifique suas credenciais.');
                }
            } else {
                toast.error('Erro inesperado ao fazer login.');
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    autoComplete="off"
                />
                {username.includes(" ") && (
                    toast.error('❌ Não use espaços no nome de usuário.')
                )}
                {/* Campo Senha + Ícone de Exibição */}
                <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPasswordState(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete="current-password"
                    />
                    <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Processando...' : 'Entrar'}
                    {loading && <div className={styles.spinner}></div>}
                </button>
                {message && <p className={styles.message}>{message}</p>}
                <div className={styles.lineContainer}>
                    <div className={styles.line} />
                    <p>ou</p>
                    <div className={styles.line} />
                </div>
                {/*<div className={styles.social_login}>*/}
                {/*    <button onClick={() => handleGoogleLogin()} className={styles.googleButton}>*/}
                {/*        <Image src={GoogleImag} alt={'google Icon'} className={styles.social_image}/>*/}
                {/*        Entrar com Google*/}
                {/*    </button>*/}
                {/*</div>*/}
                <Link href={'/reset-password'} className={styles.sword}>Esqueceu a senha?</Link>
            </form>
            <div className={styles.cadastre}>
                <p>Não tem conta?<Link href={'/register'}> Cadastre-se</Link></p>
            </div>
        </div>
    );
};

export default LoginForm;
