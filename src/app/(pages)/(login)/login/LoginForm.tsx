'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '@/app/api/axios';
import { setUser, setToken } from '@/store/slices/authSlice';
import {
    FormWrapper,
    StyledLogo,
    StyledInput,
    PasswordWrapper,
    TogglePasswordIcon,
    StyledButton,
    Spinner,
    Message,
    LineContainer,
    Line,
    ForgotPassword,
    RegisterBox, Form,
} from './LoginForm.styled';
import LogoImag from '../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

            toast.success('🎉 Login realizado com sucesso!');
            router.push('/dashboard/');
        } catch (error: any) {
            console.error(error);
            const message = error?.response?.data
                ? Object.values(error.response.data).join(' ')
                : 'Erro ao fazer login.';
            toast.error(`🚨 ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormWrapper>
            <Form onSubmit={handleSubmit} style={{width: '100%'}}>
                <StyledLogo src={LogoImag} alt="Logo CorretorLab" priority/>
                <p style={{marginBottom: '1.5rem', color: '#333', fontSize: '14px', textAlign: 'center'}}>
                    🔐 <strong>Bem-vindo de volta!</strong><br/>
                    Acesse sua conta para continuar usando o CorretorLab.
                </p>

                <StyledInput
                    type="text"
                    placeholder="Nome de Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <PasswordWrapper>
                    <StyledInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TogglePasswordIcon onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                    </TogglePasswordIcon>
                </PasswordWrapper>

                <StyledButton type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            Entrando... <Spinner/>
                        </>
                    ) : (
                        'Entrar'
                    )}
                </StyledButton>

                {message && <Message>{message}</Message>}

                <LineContainer>
                    <Line/> <span>ou</span> <Line/>
                </LineContainer>

                <ForgotPassword as={Link} href="/reset-password">
                    Esqueceu a senha?
                </ForgotPassword>

                <RegisterBox>
                    Não tem conta? <Link href="/register">Cadastre-se</Link>
                </RegisterBox>
            </Form>
        </FormWrapper>
    );
};

export default LoginForm;
