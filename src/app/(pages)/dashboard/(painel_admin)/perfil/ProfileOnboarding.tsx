// components/ProfileOnboarding.tsx
'use client';

import styled from 'styled-components';
import { FaCrown } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface Props {
    nome: string;
    emailConfirmado: boolean;
    planoAtivo: boolean;
}

const Hero = styled.section`
  background: #f7f9fc;
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Heading = styled.h1`
  font-size: 2rem;
  color: #042a75;
`;

const Subheading = styled.p`
  font-size: 1.1rem;
  margin: 1rem 0;
`;

const AlertBox = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem auto;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
`;

const CTAButton = styled.button`
  background-color: #33cccc;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #2bb3b3;
  }
`;

export default function ProfileOnboarding({ nome, emailConfirmado, planoAtivo }: Props) {
    const router = useRouter();

    const handleClick = () => {
        if (!emailConfirmado) {
            toast.warn('Por favor, confirme seu e-mail antes de seguir para os planos.');
        } else {
            router.push('/planos');
        }
    };

    return (
        <Hero>
            <Heading>Bem-vindo, {nome}!</Heading>
            <Subheading>Falta pouco para ativar sua jornada com o CorretorLab 🚀</Subheading>

            {!emailConfirmado && (
                <AlertBox>
                    <MdOutlineEmail size={24} />
                    Seu e-mail ainda não foi confirmado. Por favor, verifique sua caixa de entrada.
                </AlertBox>
            )}

            {!planoAtivo && (
                <>
                    <AlertBox>
                        <FaCrown size={20} />
                        Seu plano está inativo. Para acessar todas as funcionalidades, escolha um plano.
                    </AlertBox>
                    <CTAButton onClick={handleClick}>
                        <FaCrown /> Escolher um plano
                    </CTAButton>
                </>
            )}
        </Hero>
    );
}
