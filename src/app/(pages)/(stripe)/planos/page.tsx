// src/app/(pages)/(stripe)/planos/PlansPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plano } from '@/types/interfaces';
import PlanCard from '@/app/(pages)/(stripe)/planos/PlanCard';
import { FaBolt, FaShieldAlt, FaUserCheck } from 'react-icons/fa';
import { message } from 'antd';
import {
    BackButton,
    CardContainer,
    DifferentialItem,
    DifferentialsSection,
    FooterInfo,
    Logo,
    PageWrapper,
    Subtitle,
    Title,
    TopBar,
    TopBarContainer,
    TopBarContant,
    TopBartext
} from '@/app/(pages)/(stripe)/planos/Planos.styles';
import LogoIcon from '../../../../../public/assets/logoIcons/Icone_logo.svg';
import { toastWarning } from '@/utils/toastWithSound';
import PlanoAlerts from '@/app/(pages)/(stripe)/planos/PlanoAlerts';
import UpgradeDrawer from "@/app/(pages)/(stripe)/planos/drawer/UpgradeDrawer";

export default function PlansPage() {
    const [plans, setPlans] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const [planoFuturo, setPlanoFuturo] = useState<Plano | null>(null);
    const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
    const [novoPlanoSelecionado, setNovoPlanoSelecionado] = useState<Plano | null>(null);
    const [simulacaoDados, setSimulacaoDados] = useState<any | null>(null);
    const [promotionCode, setPromotionCode] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const slugsValidos = ['starter', 'pro', 'premium'] as const;
    const planoAtualId = profile?.plano?.id;

    const beneficiosPorPlano: Record<'starter' | 'pro' | 'premium', string[]> = {
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
            'Cora Premium com as respostas mais inteligentes e aprofundadas.',
            'Até 3 subusuários incluídos',
        ]
    };

    useEffect(() => {
        const cancelado = searchParams.get('cancelado');
        if (cancelado === 'true') {
            toastWarning('❌ Checkout cancelado. Nenhuma cobrança foi feita.');
        }
    }, [searchParams]);

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profiles/me/');
                setProfile(response.data.profile);
            } catch {
                console.error('Erro ao carregar o perfil');
            }
        };

        fetchProfile();
    }, []);

    const handleTrocaPlano = async () => {
        if (!novoPlanoSelecionado) return;

        try {
            const pirulito = await api.post('/pagamentos/trocar-plano/', {
                plano_id: novoPlanoSelecionado.id,
                promotion_code: promotionCode || undefined   // envia só se houver
            });
            console.log('plano enviado', pirulito)

            message.success('Plano alterado com sucesso!');
            router.refresh();
            setUpgradeModalVisible(false);
        } catch (err) {
            console.error(err);
            message.error('Erro ao trocar o plano. Tente novamente.');
        }
    };

    // chama /pagamentos/simular-upgrade/ e devolve os números prontos
    const fetchSimulacao = async (planoNovoId: string) => {
        const { data } = await api.post('/pagamentos/simular-upgrade/', {
            novo_plano_id: planoNovoId,
        });
        return data;  // {preco_atual, preco_novo, dias_restantes, proporcional_upgrade, desconto, valor_final_proporcional, cupom_aplicado}
    };

    useEffect(() => {
        if (profile?.cancel_at_period_end && profile.plano_agendado_id) {
            api.get(`/pagamentos/planos/${profile.plano_agendado_id}/`)
                .then((res) => setPlanoFuturo(res.data))
                .catch((err) => console.error('Erro ao buscar plano futuro:', err));
        }
    }, [profile]);

    return (
        <PageWrapper>
            <PlanoAlerts profile={profile} planoFuturo={planoFuturo} />

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
                    {plans.map((plan) => {
                        const slug = plan.nome.toLowerCase().replace('plano ', '').trim() as typeof slugsValidos[number];

                        if (!slugsValidos.includes(slug)) return null;

                        const temPlano = profile?.assinatura_status === 'active' || (profile?.assinatura_status === 'trialing' && !!profile?.assinatura_id);
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

                        const handleSelecionarPlano = async () => {
                            if (tipoAcao === 'escolher-plano') {
                                try {
                                    const res = await api.post('/pagamentos/create-checkout-session/', {
                                        price_id: plan.stripe_price_id,
                                        plano_id: plan.id,
                                    });

                                    window.location.href = res.data.checkout_url;
                                } catch (err) {
                                    console.error('Erro ao criar sessão de checkout:', err);
                                    message.error('Erro ao criar sessão de pagamento.');
                                }
                            } else {
                                try {
                                    const simulacao = await fetchSimulacao(plan.id);
                                    setSimulacaoDados(simulacao);          // novo state
                                    setNovoPlanoSelecionado(plan);
                                    setUpgradeModalVisible(true);
                                } catch (e) {
                                    message.error('Falha ao simular valores. Tente novamente.');
                                }
                            }
                        };

                        return (
                            <PlanCard
                                key={plan.id}
                                nome={plan.nome}
                                descricao={plan.descricao}
                                preco={Number(plan.preco).toFixed(2).replace('.', ',')}
                                beneficios={beneficiosPorPlano[slug]}
                                onSelect={handleSelecionarPlano}
                                destaque={slug === 'pro'}
                                modoTroca={temPlano}
                                ocultarBotao={false}
                                tipoAcao={tipoAcao}
                            />
                        );
                    })}
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

            {novoPlanoSelecionado && simulacaoDados && (
                <UpgradeDrawer
                    open={upgradeModalVisible}
                    onClose={() => setUpgradeModalVisible(false)}  // ✅ correto agora!
                    onConfirm={handleTrocaPlano}
                    planoAtualNome={profile?.plano?.nome}
                    planoNovoNome={novoPlanoSelecionado.nome}
                    promotionCode={promotionCode}
                    precoAtual={simulacaoDados.preco_atual}
                    precoNovo={simulacaoDados.preco_novo}
                    diasRestantes={simulacaoDados.dias_restantes}
                    valorProporcional={simulacaoDados.proporcional_upgrade}
                    desconto={simulacaoDados.desconto}
                    valorFinalAgora={simulacaoDados.valor_final_proporcional}
                    cupomAplicado={simulacaoDados.cupom_aplicado}
                />
            )}

        </PageWrapper>
    );
}