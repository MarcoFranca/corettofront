'use client';

import { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import { useRouter } from 'next/navigation';
import {
    PageWrapper,
    Title,
    Subtitle,
    CardContainer,
    FooterInfo,
    TopBar,
    TopBarContainer,
    TopBarContant,
    TopBartext,
    Logo,
    BackButton
} from '@/app/(pages)/(stripe)/planos/Planos.styles';
import { FaBolt } from 'react-icons/fa'; // Ícones
import LogoIcon from '../../../../../public/assets/logoIcons/Icone_logo.svg';

interface PacoteToken {
    id: string;
    nome: string;
    descricao: string;
    preco: string;
    quantidade_tokens: number;
    modelo_chatgpt: string;
    imagem_url?: string;
    stripe_price_id: string;
}

export default function PacotesTokensPage() {
    const [pacotes, setPacotes] = useState<PacoteToken[]>([]);
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => {
        const fetchPacotes = async () => {
            const { data } = await api.get('/pagamentos/pacotes/');
            setPacotes(data);
        };

        fetchPacotes();
    }, []);

    const handleComprarPacote = async (pacote: PacoteToken) => {
        try {
            const { data } = await api.post('/pagamentos/comprar-tokens/', {
                pacote_id: pacote.id,
            });
            window.location.href = data.url;
        } catch (error) {
            console.error('Erro ao iniciar compra:', error);
            alert('Erro ao iniciar compra de tokens.');
        }
    };

    const getBadge = (modelo: string) => {
        if (modelo.includes('turbo')) return 'Mais Popular';
        if (modelo === 'gpt-4.1') return 'Máxima Inteligência';
        return null;
    };

    const getMensagemInteligencia = (modelo: string) => {
        if (modelo.includes('mini')) return 'Cora padrão para tarefas cotidianas.';
        if (modelo.includes('turbo')) return 'Cora com respostas mais rápidas e elaboradas.';
        if (modelo === 'gpt-4.1') return 'Cora na potência máxima de inteligência.';
        return '';
    };

    const getEstimativaInteracoes = (modelo: string, quantidadeTokens: number) => {
        const tokensPorInteracao = modelo.includes('mini') ? 800 : 1000;
        return Math.floor(quantidadeTokens / tokensPorInteracao);
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

            <Title>Compre Tokens Extras</Title>
            <Subtitle>Amplie o poder da sua assistente Cora para quando você mais precisar!</Subtitle>

            <CardContainer>
                {pacotes.map((pacote) => (
                    <div
                        key={pacote.id}
                        onMouseEnter={() => setHoveredCard(pacote.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            maxWidth: '350px',
                            alignItems: 'center',
                            textAlign: 'center',
                            boxShadow: hoveredCard === pacote.id ? '0 8px 20px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.05)',
                            transform: hoveredCard === pacote.id ? 'translateY(-5px)' : 'translateY(0)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            position: 'relative',
                            cursor: 'pointer',
                            border: getBadge(pacote.modelo_chatgpt) === 'Mais Popular' ? '2px solid #33cccc' : 'none', // ✅ Aqui!
                        }}>
                        {/* Badge */}
                        {getBadge(pacote.modelo_chatgpt) && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#ffe600',
                                color: '#333',
                                fontWeight: 'bold',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                            }}>
                                {getBadge(pacote.modelo_chatgpt)}
                            </div>
                        )}

                        {/* Imagem */}
                        {pacote.imagem_url && (
                            <img src={pacote.imagem_url} alt={pacote.nome}
                                 style={{height: '52px', objectFit: 'cover', borderRadius: '8px'}}/>
                        )}

                        {/* Nome */}
                        <h2 style={{marginTop: '1rem', fontSize: '1.5rem', color: '#042a75'}}>{pacote.nome}</h2>

                        {/* Descrição */}
                        <p style={{color: '#555', margin: '8px 0'}}>{pacote.descricao}</p>

                        {/* Preço */}
                        <p style={{
                            fontWeight: 'bold',
                            fontSize: '1.3rem',
                            margin: '10px 0'
                        }}>R$ {pacote.preco.replace('.', ',')}</p>

                        {/* Tokens */}
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            <FaBolt size={14} style={{ color: '#33cccc', marginRight: '5px' }} />
                            {pacote.quantidade_tokens.toLocaleString()} tokens
                        </p>

                        {/* Estimativa de Interações */}
                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                            Aproximadamente {getEstimativaInteracoes(pacote.modelo_chatgpt, pacote.quantidade_tokens)} interações
                        </p>

                        {/* Inteligência da Cora */}
                        <p style={{ fontSize: '0.8rem', color: '#0099cc', marginTop: '5px', fontStyle: 'italic' }}>
                            {getMensagemInteligencia(pacote.modelo_chatgpt)}
                        </p>

                        {/* Botão Comprar */}
                        <button
                            onClick={() => handleComprarPacote(pacote)}
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                backgroundColor: '#33cccc',
                                border: 'none',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Comprar Agora
                        </button>

                        {/* Aviso sobre tokens não expirarem */}
                        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '8px' }}>
                            * Tokens não expiram até serem usados ou cancelamento da conta.
                        </p>
                    </div>
                ))}
            </CardContainer>

            <FooterInfo>
                Dúvidas? <a href="mailto:suporte@corretorlab.com">Fale com nosso suporte</a>
            </FooterInfo>
        </PageWrapper>
    );
}
