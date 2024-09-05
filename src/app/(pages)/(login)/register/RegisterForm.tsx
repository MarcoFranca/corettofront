'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/api/axios";
import styles from './styles.module.css';
import LogoImag from "../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg";
import Image from "next/image";
import Link from "next/link";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            return;
        }

        try {
            // Criação do usuário
            await api.post('/create_user/', {
                username,
                email,
                password
            });

            // Após criar o usuário, vamos autenticar o novo usuário
            const { data } = await api.post('/o/token/', {
                grant_type: 'password',
                username,
                password,
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,  // Use o client_id
                client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET  // Use o client_secret
            });

            // Armazenar os tokens no localStorage
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            localStorage.setItem('user', JSON.stringify({ username, email }));

            setMessage('Usuário cadastrado e autenticado com sucesso!');

            // Redirecionar para o dashboard
            router.push('/dashboard');
        } catch (error) {
            setMessage('Erro ao cadastrar ou autenticar usuário. Verifique os dados e tente novamente.');
            console.error('Erro ao cadastrar ou autenticar usuário:', error);
        }
    };

    return (
        <div className={styles.container_form}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Image src={LogoImag} alt={'logotipo'} className={styles.image}/>
                <p>Cadastre-se e descubra o poder do CRM especializado para corretores.</p>
                <input
                    type="text"
                    placeholder="Nome de Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirme a Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Cadastre-se</button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
            <div className={styles.conecte}>
                <p>Tem uma conta? <Link href={'/login'}>Conecte-se</Link></p>
            </div>
        </div>
    );
}
