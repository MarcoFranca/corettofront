'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../api/axios';
import styles from './styles.module.css';
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";


const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/create_user/', {
                username,
                email,
                password
            });

            // Supondo que a resposta inclui um token JWT
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));

            setMessage('Usuário cadastrado com sucesso!');

            // Redirecionar para o dashboard
            router.push('/dashboard');
        } catch (error) {
            setMessage('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
            console.error('Erro ao cadastrar usuário:', error);
        }
    };

    return (
        <>
            <SimpleNavBar/>
            <div className={styles.container}>
                <h1>Cadastro</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
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
                    <input
                        type="password"
                        placeholder="Confirme a Senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>Cadastrar</button>
                </form>
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </>
    );
};

export default RegisterPage;

