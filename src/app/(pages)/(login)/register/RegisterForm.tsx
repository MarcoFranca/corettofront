'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/api/axios";
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';  // Importa as ações do Redux
import styles from './styles.module.css';
import LogoImag from "../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg";
import Image from "next/image";
import Link from "next/link";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Inicia o carregamento
        setMessage(''); // Limpa mensagens anteriores

        if (password !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        try {
            // Criação do usuário
            await api.post('/create_user/', {
                username,
                email,
                password
            });

            // Configuração dos dados para a requisição de token
            const tokenData = new URLSearchParams();
            tokenData.append('grant_type', 'password');
            tokenData.append('username', username);
            tokenData.append('password', password);
            tokenData.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID || '');
            tokenData.append('client_secret', process.env.NEXT_PUBLIC_CLIENT_SECRET || '');

            // Autenticar o novo usuário após o registro
            const { data } = await api.post('/o/token/', tokenData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // Armazenar os tokens no Redux
            dispatch(setToken({ access: data.access_token, refresh: data.refresh_token }));

            // Buscar os detalhes do usuário autenticado
            const userDetails = await api.get('/user_detail/');

            // Armazenar os detalhes do usuário no Redux
            dispatch(setUser({ id: userDetails.data.id, username, email }));

            setMessage('Usuário cadastrado e autenticado com sucesso!');

            // Após a autenticação, iniciar o processo de checkout para o plano escolhido
            const price_id = "price_1Q4Yc3RpwSFVPEXY79g453lp";  // Aqui você pode ajustar conforme o preço do plano selecionado
            const plano_id = "e73c825e-b8f4-43b2-8227-94a2c8715181";  // Ajuste para o ID do plano desejado

            // Iniciar sessão de checkout com a API de pagamentos
            const response = await api.post('/pagamentos/create-checkout-session/', {
                price_id,
                plano_id
            });

            if (response.data && response.data.checkout_url) {
                // Redirecionar o usuário para a página de checkout
                router.push(response.data.checkout_url);
            } else {
                setMessage('Erro ao redirecionar para o pagamento. Tente novamente mais tarde.');
            }

        } catch (error: any) {
            if (error.response && error.response.data) {
                // Exibe a mensagem de erro específica vinda do backend
                setMessage(Object.values(error.response.data).join(' '));
            } else {
                setMessage('Erro ao cadastrar ou autenticar usuário. Verifique os dados e tente novamente.');
            }
        } finally {
            setLoading(false); // Encerra o carregamento
        }
    };

    return (
        <div className={styles.container_form}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Image src={LogoImag} alt={'logotipo'} className={styles.image} />
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
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Entrando...' : 'Cadastre-se'}
                    {loading && <div className={styles.spinner}></div>}
                </button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
            <div className={styles.conecte}>
                <p>Tem uma conta? <Link href={'/login'}>Conecte-se</Link></p>
            </div>
        </div>
    );
}
