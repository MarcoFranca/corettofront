'use client';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import { FaRegEnvelopeOpen } from 'react-icons/fa';
import LogoImag from '../../../../../public/assets/logoIcons/Logo_transparente_escura_vertical.svg';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9fafc;
    padding: 2rem;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 2.2rem;
    color: #042a75;
    margin: 1.5rem 0 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #333;
  max-width: 480px;
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const EnvelopeIcon = styled(FaRegEnvelopeOpen)`
  font-size: 3rem;
  color: #33cccc;
  animation: ${pulse} 2s infinite;
  margin-bottom: 1rem;
`;

export default function AguardandoConfirmacao() {
    return (
        <Container>
            <Image src={LogoImag} alt="Logo CorretorLab" width={150} height={150} />
            <EnvelopeIcon />
            <Title>Quase lá! 🚀</Title>
            <Message>
                Enviamos um link de confirmação para <strong>seu e-mail</strong>. <br />
                Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
            </Message>
        </Container>
    );
}
