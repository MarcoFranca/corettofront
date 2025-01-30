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
import {toast} from "react-toastify"; // Ícones de olho

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (password !== confirmPassword) {
            toast.warning('⚠️ As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            toast.warning('⚠️ O nome de usuário deve ter pelo menos 3 caracteres.');
            setLoading(false);
            return;
        }


        try {
            await api.post('/create_user/', { username, email, password });

            const tokenData = new URLSearchParams();
            tokenData.append('grant_type', 'password');
            tokenData.append('username', username);
            tokenData.append('password', password);
            tokenData.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID || '');
            tokenData.append('client_secret', process.env.NEXT_PUBLIC_CLIENT_SECRET || '');

            const { data } = await api.post('/o/token/', tokenData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            dispatch(setToken({ access: data.access_token, refresh: data.refresh_token }));

            const userDetails = await api.get('/user_detail/', {
                headers: { Authorization: `Bearer ${data.access_token}` },
            });

            dispatch(setUser({
                id: userDetails.data.id,
                username,
                email,
                profileImage: userDetails.data.profileImage || '',
            }));

            toast.success('🥳 Usuário cadastrado e autenticado com sucesso! 🎉🎊')

            const price_id = process.env.NEXT_PUBLIC_PRICE_ID || '';
            const plano_id = process.env.NEXT_PUBLIC_PLANO_ID || '';
            await handleCheckout(price_id, plano_id);
        } catch (error: any) {
            console.error('Erro ao cadastrar ou autenticar usuário:', error);

            if (error.response && error.response.data) {
                // 🎯 Mapeia erros específicos vindos do backend
                const errors = error.response.data;

                if (errors.username) {
                    toast.error(`❌ ${errors.username}`);
                }
                if (errors.email) {
                    toast.error(`❌ ${errors.email}`);
                }
                if (errors.password) {
                    toast.error(` ${errors.password}`);
                }
            } else {
                toast.error('🚨 Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
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

    const handleCheckout = async (price_id: string, plano_id: string) => {
        console.log('price_id:', price_id, 'plano_id:', plano_id);
        try {
            const response = await api.post('/pagamentos/create-checkout-session/', {
                price_id,
                plano_id,
            });

            if (response.data && response.data.checkout_url) {
                router.push(response.data.checkout_url);
            } else {
                setMessage('Erro ao redirecionar para o pagamento. Tente novamente mais tarde.');
                toast.error('🚨 Erro ao redirecionar para o pagamento. Tente novamente mais tarde. 🚨')
            }
        } catch (error) {
            console.error('Erro ao iniciar o checkout:', error);
            setMessage('Erro ao redirecionar para o pagamento.');
            toast.error('🚨 Erro ao redirecionar para o pagamento. 🚨')
        }
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
