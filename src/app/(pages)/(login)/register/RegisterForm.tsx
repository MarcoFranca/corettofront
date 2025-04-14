// src/app/(pages)/(login)/register/RegisterForm.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/api/axios";
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import {
    FormWrapper,
    StyledForm,
    StyledLogo,
    StyledInput,
    InputWrapper,
    TogglePasswordIcon,
    StyledButton,
    Spinner,
    WelcomeText,
    SwitchText,
} from './RegisterForm.styled';
import LogoImag from '../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { toastError, toastSuccess, toastWarning } from "@/utils/toastWithSound";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

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

            const { access_token, refresh_token, user } = response.data;
            sessionStorage.setItem('accessToken', access_token);
            sessionStorage.setItem('refreshToken', refresh_token);
            sessionStorage.setItem('userEmail', email);

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

    return (
        <FormWrapper>
            <StyledForm onSubmit={handleSubmit}>
                <StyledLogo src={LogoImag} alt="Logo CorretorLab" priority />
                <WelcomeText>
                    🚀 Crie sua conta e descubra o poder de um CRM feito para corretores!
                </WelcomeText>

                <StyledInput
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <StyledInput
                    type="text"
                    placeholder="Nome de usuário (sem espaços)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    required
                />

                <InputWrapper>
                    <StyledInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TogglePasswordIcon onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </TogglePasswordIcon>
                </InputWrapper>

                <InputWrapper>
                    <StyledInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme a senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <TogglePasswordIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </TogglePasswordIcon>
                </InputWrapper>

                <StyledButton type="submit" disabled={loading}>
                    {loading ? <>Cadastrando... <Spinner /></> : 'Cadastre-se'}
                </StyledButton>

                <SwitchText>
                    Já tem uma conta? <Link href="/login">Conecte-se</Link>
                </SwitchText>
            </StyledForm>
        </FormWrapper>
    );
}
