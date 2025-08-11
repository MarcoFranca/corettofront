import type { Metadata } from 'next';
import Link from 'next/link';
import {
    LPWrapper, Section, Container, HeaderBar, NavLink,
    HeroGrid, Title, Subtitle, BadgeRow, Bullets,
    CtaRow, ButtonPrimary, ButtonGhost, Card, ProofBar,
    FeatureGrid, FeatureCard, IconCircle, Steps,
    Testimonial, PlansGrid, PriceCard, Faq, Footer, MobileCtaBar
} from './LP.styles';

// Ícones do Ant Design (já estão no projeto)
import {
    TableOutlined,
    FileProtectOutlined,
    CalendarOutlined,
    RobotOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

export const metadata: Metadata = {
    title: 'CorretorLab CRM – CRM para Corretores de Seguros',
    description:
        'Organize negociações e apólices, agende pelo Google e use a IA Cora para ganhar produtividade. Teste grátis 14 dias.',
    openGraph: {
        title: 'CorretorLab CRM – CRM para Corretores de Seguros',
        description: 'Negociações em tabelas, apólices, Google Agenda/Meet e IA Cora. Teste grátis 14 dias.',
        url: 'https://corretorlab.com/lp/crm-corretor',
        siteName: 'CorretorLab',
    },
};

const UTM = '?utm_source=google&utm_medium=cpc&utm_campaign=lp_crm_corretor';

export default function Page() {
    return (
        <LPWrapper>
            <HeaderBar>
                <div className="wrap">
                    <div className="brand">🛡️ CorretorLab CRM</div>
                    <nav className="nav">
                        <NavLink href="#beneficios">Benefícios</NavLink>
                        <NavLink href="#como-funciona">Como funciona</NavLink>
                        <NavLink href="#precos">Planos</NavLink>
                        <NavLink href="/terms_of_service" target="_blank">Termos</NavLink>
                        <NavLink href="/privacy_policy" target="_blank">Privacidade</NavLink>
                    </nav>
                </div>
            </HeaderBar>

            {/* HERO */}
            <Section $alt>
                <Container>
                    <HeroGrid>
                        <div>
                            <Title>O CRM direto ao ponto para Corretores</Title>
                            <Subtitle>
                                Saia das planilhas. Organize <strong>negociações</strong> e <strong>apólices</strong> em um só lugar,
                                agende pelo <strong>Google</strong> e use a <strong>IA Cora</strong> para ganhar tempo todos os dias.
                            </Subtitle>

                            <BadgeRow>
                                <span><SafetyCertificateOutlined /> LGPD • Termos • DPA</span>
                                <span><ThunderboltOutlined /> Trial 14 dias — sem cartão</span>
                            </BadgeRow>

                            <Bullets>
                                <li>Negociações em tabelas com filtros e status</li>
                                <li>Apólices organizadas: histórico, documentos e revisões</li>
                                <li>Google Agenda/Meet integrado para reuniões</li>
                                <li>IA Cora: textos, checklists e apoio na rotina</li>
                            </Bullets>

                            <CtaRow>
                                <ButtonPrimary href={`/register${UTM}`}>Começar agora <ArrowRightOutlined /></ButtonPrimary>
                                <ButtonGhost href={`/demo${UTM}`}>Ver demo</ButtonGhost>
                            </CtaRow>

                            <p style={{marginTop:10, opacity:.85}}>Cancelamento a qualquer momento.</p>
                        </div>

                        <Card>
                            <div style={{display:'grid', gap:12}}>
                                <div className="row" style={{display:'flex', alignItems:'center'}}>
                                    <IconCircle><TableOutlined /></IconCircle>
                                    <div>
                                        <strong>Negociações claras</strong>
                                        <div style={{fontSize:13, opacity:.8}}>Visual por status, prioridade e valor</div>
                                    </div>
                                </div>
                                <div className="row" style={{display:'flex', alignItems:'center'}}>
                                    <IconCircle><FileProtectOutlined /></IconCircle>
                                    <div>
                                        <strong>Apólices organizadas</strong>
                                        <div style={{fontSize:13, opacity:.8}}>Informações, documentos e próximos passos</div>
                                    </div>
                                </div>
                                <div className="row" style={{display:'flex', alignItems:'center'}}>
                                    <IconCircle><CalendarOutlined /></IconCircle>
                                    <div>
                                        <strong>Agenda/Meet Google</strong>
                                        <div style={{fontSize:13, opacity:.8}}>Agende e compartilhe links sem fricção</div>
                                    </div>
                                </div>
                                <div className="row" style={{display:'flex', alignItems:'center'}}>
                                    <IconCircle><RobotOutlined /></IconCircle>
                                    <div>
                                        <strong>IA Cora integrada</strong>
                                        <div style={{fontSize:13, opacity:.8}}>Textos prontos e apoio à produtividade</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </HeroGrid>

                    <div style={{height:16}}/>

                    <ProofBar>
                        <div className="pill"><SafetyCertificateOutlined /> Feito para LGPD</div>
                        <div className="pill"><CalendarOutlined /> Integração Google</div>
                        <div className="pill"><RobotOutlined /> IA Cora nativa</div>
                        <div className="pill"><FileProtectOutlined /> Termos & DPA</div>
                    </ProofBar>
                </Container>
            </Section>

            {/* BENEFÍCIOS CHAVE */}
            <Section id="beneficios" $alt>
                <Container>
                    <FeatureGrid>
                        <FeatureCard>
                            <h3><TableOutlined /> Negociações em Tabelas</h3>
                            <p>Veja oportunidades por status e prioridade. Filtros e histórico para nunca perder follow-up.</p>
                        </FeatureCard>
                        <FeatureCard>
                            <h3><FileProtectOutlined /> Gestão de Apólices</h3>
                            <p>Dados e documentos centralizados por cliente e produto. Acompanhe revisões e renovações.</p>
                        </FeatureCard>
                        <FeatureCard>
                            <h3><RobotOutlined /> IA Cora no dia a dia</h3>
                            <p>Textos, checklists e insights para acelerar propostas e atendimento.</p>
                        </FeatureCard>
                    </FeatureGrid>
                </Container>
            </Section>

            {/* COMO FUNCIONA */}
            <Section>
                <Container>
                    <h2 style={{margin:'0 0 14px'}}>Como funciona</h2>
                    <Steps>
                        <li><strong>Crie sua conta</strong> e ative o trial de 14 dias.</li>
                        <li><strong>Cadastre clientes e apólices</strong> ou importe seus dados.</li>
                        <li><strong>Conecte Google Agenda/Meet</strong> e gerencie negociações com mais controle.</li>
                    </Steps>
                </Container>
            </Section>

            {/* DEPOIMENTO */}
            <Section $alt>
                <Container>
                    <Testimonial>
                        “Organizei minhas negociações e parei de deixar cliente sem retorno. As reuniões pelo Google e a Cora
                        fizeram o dia render bem mais.”
                        <cite>— Ana, corretora de saúde (SP)</cite>
                    </Testimonial>
                </Container>
            </Section>

            {/* PLANOS */}
            <Section id="precos">
                <Container>
                    <h2 style={{margin:'0 0 16px'}}>Plano simples e transparente</h2>
                    <PlansGrid>
                        <PriceCard>
                            <h3>Profissional</h3>
                            <div className="price">R$ 197/mês</div>
                            <ul>
                                <li>Negociações e apólices ilimitadas</li>
                                <li>Google Agenda/Meet integrado</li>
                                <li>IA Cora inclusa</li>
                                <li>Suporte prioritário</li>
                            </ul>
                            <div style={{marginTop:14}}>
                                <Link href={`/auth/register${UTM}`} style={{textDecoration:'none'}}>
                                    <button style={{
                                        background:'currentColor',
                                        color:'#fff',
                                        padding:'12px 18px',
                                        border:0,
                                        borderRadius:12,
                                        fontWeight:700,
                                        cursor:'pointer'
                                    }}>
                                        Começar agora
                                    </button>
                                </Link>
                            </div>
                        </PriceCard>

                        <PriceCard>
                            <h3>Equipe</h3>
                            <div className="price">Fale com a gente</div>
                            <ul>
                                <li>Usuários adicionais</li>
                                <li>Permissões e segurança</li>
                                <li>Onboarding assistido</li>
                            </ul>
                            <div style={{marginTop:14}}>
                                <Link href={`/contato${UTM}`} style={{textDecoration:'none'}}>
                                    <button style={{
                                        background:'#ffffff',
                                        color:'inherit',
                                        padding:'12px 18px',
                                        border:'1px solid currentColor',
                                        borderRadius:12,
                                        fontWeight:700,
                                        cursor:'pointer'
                                    }}>
                                        Agendar conversa
                                    </button>
                                </Link>
                            </div>
                        </PriceCard>
                    </PlansGrid>
                    <p style={{marginTop:10, opacity:.85}}>* Trial de 14 dias sem cartão. Cancele quando quiser.</p>
                </Container>
            </Section>

            {/* FAQ (objeções reais) */}
            <Section $alt>
                <Container>
                    <h2 style={{margin:'0 0 12px'}}>Dúvidas frequentes</h2>
                    <Faq>
                        <details>
                            <summary>Preciso de cartão para o teste?</summary>
                            <p>Não. Você cria a conta, usa 14 dias e só depois escolhe o plano.</p>
                        </details>
                        <details>
                            <summary>Já tenho clientes em planilha. Consigo importar?</summary>
                            <p>Sim. Você pode começar simples cadastrando os principais, e importar conforme sua necessidade.</p>
                        </details>
                        <details>
                            <summary>É compatível com a LGPD?</summary>
                            <p>Sim. Tratamos os dados conforme a LGPD e disponibilizamos Termos/Política e DPA.</p>
                        </details>
                        <details>
                            <summary>Posso agendar pelo Google?</summary>
                            <p>Sim. Integração nativa com Google Agenda/Meet para suas reuniões com clientes.</p>
                        </details>
                    </Faq>
                </Container>
            </Section>

            {/* CTA fixo no mobile */}
            <MobileCtaBar>
                <Link href={`/auth/register${UTM}`} style={{textDecoration:'none'}}>
                    <button style={{
                        width:'100%', background:'currentColor', color:'#fff', padding:'12px 14px',
                        border:0, borderRadius:10, fontWeight:800
                    }}>
                        Começar agora
                    </button>
                </Link>
                <Link href={`/demo${UTM}`} style={{textDecoration:'none'}}>
                    <button style={{
                        width:'100%', background:'#fff', color:'inherit', padding:'12px 14px',
                        border:'1px solid currentColor', borderRadius:10, fontWeight:800
                    }}>
                        Ver demo
                    </button>
                </Link>
            </MobileCtaBar>

            {/* RODAPÉ */}
            <Footer>
                <Container>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
                        <small>© {new Date().getFullYear()} CorretorLab. Todos os direitos reservados.</small>
                        <div className="links">
                            <a href="/terms_of_service" target="_blank" rel="noopener">Termos</a>
                            <a href="/privacy_policy" target="_blank" rel="noopener">Privacidade</a>
                            <a href="/dpa" target="_blank" rel="noopener">DPA</a>
                        </div>
                    </div>
                </Container>
            </Footer>
        </LPWrapper>
    );
}
