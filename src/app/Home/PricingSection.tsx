// src/app/Home/PricingSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/axios';
import PlanCard from '@/app/(pages)/(stripe)/planos/PlanCard';
import { message } from 'antd';
import {
    SectionWrapper,
    SectionTitle,
    CardContainer
} from './PricingSection.styled';
import type { Plano } from '@/types/interfaces';

type PlanoSlug = 'starter' | 'pro' | 'premium';
const slugsValidos: PlanoSlug[] = ['starter', 'pro', 'premium'];

const beneficiosPorPlano: Record<PlanoSlug, string[]> = {
    starter: [
        'CRM completo e focado em seguros',
        'Gestão de leads e apólices',
        'Integração com Google Agenda',
        'Até 10 interações com a Cora no trial',
    ],
    pro: [
        'Tudo do Starter ✅',
        'Acesso à Cora Avançada (50.000 tokens)',
        'Até 2 subusuários incluídos',
        'Insights inteligentes e suporte prioritário',
    ],
    premium: [
        'Tudo do Pro ✅',
        'Mais interações com a Cora por mês (100.000 tokens)',
        'Cora Premium com respostas mais profundas',
        'Até 3 subusuários incluídos',
    ],
};

export default function PricingSection() {
    const router = useRouter();

    const [plans, setPlans] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null); // visitante = null
    const [isVisitor, setIsVisitor] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [plansRes, meRes] = await Promise.allSettled([
                    api.get('/pagamentos/planos/'),
                    api.get('/profiles/me/'),
                ]);

                if (plansRes.status === 'fulfilled') {
                    setPlans(plansRes.value.data);
                } else {
                    message.error('Erro ao carregar planos.');
                }

                if (meRes.status === 'fulfilled') {
                    setProfile(meRes.value.data.profile);
                    setIsVisitor(false);
                } else {
                    // provavel 401 → visitante
                    setIsVisitor(true);
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const planoAtualId = profile?.plano?.id;
    const temPlano =
        profile?.assinatura_status === 'active' ||
        (profile?.assinatura_status === 'trialing' && !!profile?.assinatura_id);

    const handleSelectPlan = async (plan: Plano) => {
        // Visitante: leva pra /planos para escolher/checkout
        if (isVisitor) {
            // manda criar conta e volta pra /planos com o plano marcado
            const next = encodeURIComponent(`/planos?select=${plan.id}`);
            router.push(`/register?next=${next}`);
            return;
        }

        // Logado:
        const precoAtual = Number(profile?.plano?.preco ?? 0);
        const precoNovo = Number(plan.preco);
        const tipoAcao: 'plano-atual' | 'upgrade' | 'downgrade' | 'cancelar-downgrade' | 'escolher-plano' =
            !temPlano
                ? 'escolher-plano'
                : plan.id === planoAtualId
                    ? 'plano-atual'
                    : plan.id === profile?.plano_agendado_id && profile?.cancel_at_period_end
                        ? 'cancelar-downgrade'
                        : precoNovo > precoAtual
                            ? 'upgrade'
                            : 'downgrade';

        try {
            if (tipoAcao === 'escolher-plano') {
                // checkout direto
                const res = await api.post('/pagamentos/create-checkout-session/', {
                    price_id: plan.stripe_price_id,
                    plano_id: plan.id,
                });
                window.location.href = res.data.checkout_url;
                return;
            }

            // Para upgrade/downgrade/cancelar-downgrade, mantemos a UX central na página de planos
            router.push('/planos');
        } catch (err) {
            console.error(err);
            message.error('Não foi possível iniciar a assinatura. Tente novamente.');
        }
    };

    if (loading) {
        return (
            <SectionWrapper>
                <SectionTitle>Planos</SectionTitle>
                <p>Carregando...</p>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper>
            <SectionTitle>Planos para acelerar sua corretora</SectionTitle>

            <CardContainer>
                {plans
                    .map((plan) => {
                        const slug = plan.nome.toLowerCase().replace('plano ', '').trim() as PlanoSlug;
                        if (!slugsValidos.includes(slug)) return null;

                        return (
                            <PlanCard
                                key={plan.id}
                                nome={plan.nome}
                                descricao={plan.descricao}
                                preco={Number(plan.preco).toFixed(2).replace('.', ',')}
                                beneficios={beneficiosPorPlano[slug]}
                                onSelect={() => handleSelectPlan(plan)}
                                destaque={slug === 'pro'}
                                modoTroca={!isVisitor && temPlano}
                                ocultarBotao={false}
                                // Na home não calculamos todas as variações de ação;
                                // deixamos o fluxo completo para /planos (UX centralizada).
                                tipoAcao={!isVisitor && plan.id === planoAtualId ? 'plano-atual' : 'escolher-plano'}
                            />
                        );
                    })}
            </CardContainer>
        </SectionWrapper>
    );
}
