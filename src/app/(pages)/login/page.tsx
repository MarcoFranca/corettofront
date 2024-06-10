// src/app/pages/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../axios';
import styles from './styles.module.css';
import Link from "next/link";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/token/', {
                username,
                password
            });

            // Supondo que a resposta inclui um token JWT e detalhes do usuário
            const { access, refresh } = response.data;
            console.log('Tokens recebidos:', response.data);
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // Opcional: Obter detalhes do usuário (dependendo da API)
            const userResponse = await api.get('/user_detail/', {
              headers: { Authorization: `Bearer ${access}` }
            });
            const user = userResponse.data;
            localStorage.setItem('user', JSON.stringify(user));

            setMessage('Login bem-sucedido!');

            // Redirecionar para o dashboard
            router.push('/dashboard');
        } catch (error) {
            setMessage('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Nome de Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <button type="submit" className={styles.button}>Login</button>
            </form>
            <Link href={'/register'} >Ja tem Cadastro? clique aqui! </Link>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default LoginPage;
