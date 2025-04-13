'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/api/axios";
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import styles from './styles.module.css';
import LogoImag from "../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {toastError, toastSuccess, toastWarning} from "@/utils/toastWithSound"; // Ícones de olho

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toastWarning('⚠️ As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            toastWarning('⚠️ O nome de usuário deve ter pelo menos 3 caracteres.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/create_user/', {
                username,
                email,
                password,
            });

            const {
                access_token,
                refresh_token,
                user,
            } = response.data;

            // Salva os tokens temporários
            sessionStorage.setItem('accessToken', access_token);
            sessionStorage.setItem('refreshToken', refresh_token);

            // Opcional: se quiser salvar user temporário no Redux
            dispatch(setToken({ access: access_token, refresh: refresh_token }));
            dispatch(setUser(user));

            toastSuccess('📩 Cadastro realizado! Enviamos um link de confirmação para seu e-mail.');
            router.push('/aguardando-confirmacao');
        } catch (error: any) {
            if (error.response?.data) {
                const errors = error.response.data;
                if (errors.username) toastError(`❌ ${errors.username}`);
                if (errors.email) toastError(`❌ ${errors.email}`);
                if (errors.password) toastError(`❌ ${errors.password}`);
            } else {
                toastError('🚨 Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={styles.container_form}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Image src={LogoImag} alt={'logotipo'} className={styles.image}/>
                <p>Cadastre-se e descubra o poder do CRM especializado para corretores.</p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                    autoComplete="off"
                />

                <input
                    type="text"
                    placeholder="Nome de Usuário (sem espaços)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    className={styles.input}
                    required
                    autoComplete="off"
                />
                {username.includes(" ") && (
                    <p className={styles.errorMessage}>❌ Não use espaços no nome de usuário.</p>
                )}

                {/* Campo de Senha */}
                <div className={styles.inputWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete="new-password"
                    />
                    <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {/* Campo de Confirmação de Senha */}
                <div className={styles.inputWrapper}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme a Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                        required
                        autoComplete="new-password"
                    />
                    <span className={styles.eyeIcon} onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Processando...' : 'Cadastre-se'}
                    {loading && <div className={styles.spinner}></div>}
                </button>
            </form>
            <div className={styles.conecte}>
                <p>Tem uma conta? <Link href={'/login'}>Conecte-se</Link></p>
            </div>
        </div>
    );
}
