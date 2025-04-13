'use client'
import React, { useState } from 'react';
import styled from 'styled-components';
import api from '@/app/api/axios';
import { toast } from 'react-toastify';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #042a75;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #33cccc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: #333;
  margin-top: 1rem;
`;

export default function ReenviarConfirmacaoPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/reenviar-confirmacao/', { email });
            toast.success('📩 ' + response.data.message);
            setMessage('Verifique sua caixa de entrada para confirmar o e-mail.');
        } catch (error: any) {
            if (error.response?.data?.error) {
                toast.error('⚠️ ' + error.response.data.error);
            } else {
                toast.error('❌ Erro ao reenviar confirmação.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Reenviar Confirmação de E-mail</Title>
            <form onSubmit={handleSubmit}>
                <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Reenviar E-mail de Confirmação'}
                </Button>
            </form>
            {message && <Message>{message}</Message>}
        </Container>
    );
}
