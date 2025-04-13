'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import { useRouter } from 'next/navigation';
import { Plano } from '@/types/interfaces';
import PlanCard from "@/app/(pages)/(stripe)/planos/PlanCard";
import {FaBolt, FaShieldAlt, FaUserCheck} from "react-icons/fa";

import {
    PageWrapper,
    Title,
    CardContainer,
    DifferentialItem,
    DifferentialsSection,
    Subtitle,
    FooterInfo,
    Logo,
    TopBar,
    BackButton, TopBarContant, TopBartext, TopBarContainer
} from "@/app/(pages)/(stripe)/planos/Planos.styles";
import LogoIcon from '../../../../../public/assets/logoIcons/Icone_logo.svg'

export default function PlansPage() {
    const [plans, setPlans] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/pagamentos/planos/');
                setPlans(response.data);
            } catch {
                setError('Erro ao carregar planos.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSelectPlan = async (price_id: string, plano_id: string) => {
        try {
            const response = await api.post('/pagamentos/create-checkout-session/', {
                price_id,
                plano_id,
            });
            router.push(response.data.checkout_url);
        } catch {
            setError('Erro ao redirecionar para o checkout.');
        }
    };

    return (
        <PageWrapper>
            <TopBar>
                <TopBarContainer>
                    <BackButton onClick={() => router.push('/dashboard')}>
                        ← Voltar ao sistema
                    </BackButton>
                    <TopBarContant>
                        <Logo src={LogoIcon} alt="CorretorLab" priority />
                        <TopBartext>
                            <strong style={{ fontSize: '1rem', color: '#042a75' }}>CorretorLab</strong>
                            <small style={{ fontSize: '0.85rem', color: '#666' }}>
                                CRM especializado para corretores de seguros
                            </small>
                        </TopBartext>
                    </TopBarContant>
                </TopBarContainer>
            </TopBar>
            <Title>Escolha o Plano Ideal</Title>
            <Subtitle>
                Uma única assinatura para transformar sua corretora. Simplifique sua rotina, aumente sua produtividade
                e ofereça uma experiência premium aos seus clientes.
            </Subtitle>
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <CardContainer>
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            nome={plan.nome}
                            descricao={plan.descricao}
                            preco={Number(plan.preco).toFixed(2).replace('.', ',')}
                            beneficios={[
                                'CRM focado em seguros',
                                'Gestão de leads e apólices',
                                'Integração com Google Agenda',
                                'Acesso ao portal de pagamento',
                            ]}
                            onSelect={() => handleSelectPlan(plan.stripe_price_id, plan.id)}
                            destaque={plan.nome.toLowerCase().includes('mensal')}
                        />
                    ))}
                </CardContainer>
            )}
            <DifferentialsSection>
                <DifferentialItem>
                    <FaUserCheck size={28} />
                    <p>Desenvolvido para corretores</p>
                </DifferentialItem>
                <DifferentialItem>
                    <FaBolt size={28} />
                    <p>Ativação imediata</p>
                </DifferentialItem>
                <DifferentialItem>
                    <FaShieldAlt size={28} />
                    <p>Segurança de nível bancário</p>
                </DifferentialItem>
            </DifferentialsSection>
            <FooterInfo>
                Dúvidas? <a href="mailto:suporte@corretorlab.com">Fale com nosso suporte</a>
            </FooterInfo>
        </PageWrapper>
    );
}
