"use client";
import Image from "next/image";
import Link from "next/link";
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";
import HeroImage from "../../public/assets/pages/site/hero.png";
import styles from "./page.module.css";
import Lottie from "react-lottie-player";
import { useState } from "react";
import { motion } from "framer-motion";

// icons
import businessPlanAnimation from "@/../public/lotties/business-plan.json";
import calendarAnimation from "@/../public/lotties/calendar.json";
import automateAnimation from "@/../public/lotties/automacao.json";


export default function Home() {
    // Estados para controle das animações
    const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
    const [hasMouseLeft, setHasMouseLeft] = useState<{ [key: number]: boolean }>({});
    const [animationKey, setAnimationKey] = useState<{ [key: number]: number }>({});

    // Inicia a animação ao passar o mouse
    const handleMouseEnter = (index: number) => {
        setAnimationKey((prev) => ({ ...prev, [index]: Math.random() })); // 🔥 Reseta a animação
        setIsPlaying((prev) => ({ ...prev, [index]: true }));
        setHasMouseLeft((prev) => ({ ...prev, [index]: false }));
    };

    // Marca que o mouse saiu, mas não interrompe a animação
    const handleMouseLeave = (index: number) => {
        setHasMouseLeft((prev) => ({ ...prev, [index]: true }));
    };

    // Quando a animação termina, só para se o mouse já tiver saído
    const handleAnimationComplete = (index: number) => {
        if (hasMouseLeft[index]) {
            setIsPlaying((prev) => ({ ...prev, [index]: false }));
        }
    };

    return (
        <div className={styles.homeCotainer}>
            <SimpleNavBar />

            <main className={styles.main}>
                {/* Hero Section */}
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                    className={styles.heroSection}
                >
                    <div className={styles.heroContent}>
                        <h1>CRM para corretores que querem crescer.</h1>
                        <p>
                            Simplifique suas vendas, acompanhe negociações em tempo real e conquiste mais clientes.
                        </p>
                        <div className={styles.buttons}>
                            <Link className={styles.primaryButton} href="/register">
                                Teste Grátis por 15 Dias
                            </Link>
                            <Link className={styles.secondaryButton} href="https://wa.me/5521990050220"
                                  target="_blank">
                                Fale com Vendas
                            </Link>
                        </div>
                    </div>
                    <Image className={styles.heroImage} src={HeroImage} alt="CRM para Corretores" priority/>
                </motion.section>

                {/* Funcionalidades em Destaque */}
                <div className={styles.sectionDivider}></div>
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                    className={styles.featuresSection}
                ><h2>Funcionalidades que você vai amar</h2>
                    <div className={styles.featuresGrid}>
                        {[
                            {
                                title: "Organização Avançada",
                                desc: "Organize leads e clientes com etapas personalizadas de negociação.",
                                lootie: businessPlanAnimation
                            },
                            {
                                title: "Agenda Integrada",
                                desc: "Integração direta com Google Agenda e Google Meet.",
                                lootie: calendarAnimation
                            },
                            {
                                title: "Automação de Tarefas",
                                desc: "Automatize tarefas repetitivas e foque no que realmente importa.",
                                lootie: automateAnimation
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={styles.featureCard}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                            >
                                <div className={styles.featureCardTitle}>
                                    <Lottie
                                        key={animationKey[index]} // 🔥 Resetando animação ao mudar key
                                        loop={false} // 🔥 Mantém a animação normal
                                        animationData={feature.lootie}
                                        play={isPlaying[index] || false}
                                        onComplete={() => handleAnimationComplete(index)} // 🔥 Finaliza antes de parar
                                    />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Plano disponível */}
                <div className={styles.sectionDivider}></div>
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                    className={styles.pricingSection}
                >
                    <h2>Plano Simples e Acessível</h2>
                    <div className={styles.pricingCard}>
                        <h3>CorretorLab Pro</h3>
                        <p className={styles.price}>
                            R$ 107,00<span>/mês</span>
                        </p>
                        <ul>
                            <li>Teste gratuito de 15 dias</li>
                            <li>Todos os recursos liberados</li>
                            <li>Sem limites de uso</li>
                            <li>Suporte exclusivo</li>
                        </ul>
                        <Link href="/register" className={styles.primaryButton}>
                            Teste Grátis
                        </Link>
                    </div>
                </motion.section>

                {/* Vídeo Demonstrativo */}
                <div className={styles.sectionDivider}></div>
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                    className={styles.videoSection}
                >
                    <h2>Veja o CorretorLab em ação</h2>
                    <div className={styles.videoWrapper}>
                        <iframe
                            width="100%"
                            height="500"
                            src="https://www.youtube.com/embed/seu_video_aqui"
                            title="Demonstração CorretorLab"
                            allowFullScreen
                        ></iframe>
                    </div>
                </motion.section>

                {/* FAQ */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={styles.faqSection}
                >
                    <h2>Perguntas Frequentes</h2>
                    <div className={styles.faqItem}>
                        <h4>Posso cancelar a qualquer momento?</h4>
                        <p>Sim, você pode cancelar a assinatura quando quiser, sem burocracia.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>Preciso fornecer cartão de crédito para o teste?</h4>
                        <p>Sim, o teste gratuito de 15 dias precisa do cartão de crédito,
                            mas voce pode cancelar antes de acabar o teste.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>O sistema é integrado ao WhatsApp?</h4>
                        <p>Sim, você pode facilmente enviar mensagens diretamente pelo WhatsApp através do CRM.</p>
                    </div>
                </motion.section>
            </main>

            <footer className={styles.footer}>
                <p>&copy; 2024 CorretorLab. Todos os direitos reservados.</p>
                <div className={styles.footerLinks}>
                    <Link href="/privacy_policy">Política de Privacidade</Link>
                    <Link href="/terms_of_service">Termos de Serviço</Link>
                </div>
            </footer>
        </div>
    );
}
