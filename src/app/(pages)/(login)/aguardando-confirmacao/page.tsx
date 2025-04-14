'use client';
import { useEffect, useState } from 'react';
import LogoImag from '../../../../../public/assets/logoIcons/Logo_transparente_escuro_horizontal.svg';
import {
    Title,
    Logo,
    Card,
    ResendLink,
    EnvelopeIcon,
    Message,
    Container,
} from "@/app/(pages)/(login)/aguardando-confirmacao/AguardandoConfirmacao.styled";
import api from "@/app/api/axios";
import { toast } from 'react-toastify';
import {Spinner} from "@/app/(pages)/(login)/login/LoginForm.styled";

export default function AguardandoConfirmacao() {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleResend = async () => {
        if (!email) {
            toast.error('❌ Não foi possível recuperar seu e-mail. Faça login novamente.');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/reenviar-confirmacao/', { email });

            toast.success(response.data.message || '📨 Novo e-mail de confirmação enviado!');
        } catch (error: any) {
            const msg = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao reenviar o e-mail.';
            toast.error(`🚨 ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card>
                <Logo src={LogoImag} alt="Logo CorretorLab" width={150} height={150} priority />
                <EnvelopeIcon />
                <Title>Quase lá! 🚀</Title>
                <Message>
                    Enviamos um link de confirmação para <strong>{email ?? 'seu e-mail'}</strong>.<br />
                    Verifique sua caixa de entrada e clique no link para ativar sua conta.
                </Message>
                <ResendLink onClick={handleResend} disabled={loading}>
                    {loading ? <>Reenviando... <Spinner /></> : 'Reenviar e-mail de confirmação'}
                </ResendLink>
            </Card>
        </Container>
    );
}
