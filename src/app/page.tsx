"use client";
import Link from "next/link";
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";
import styles from "./page.module.css";
import { motion } from "framer-motion";

// import YouTube, { YouTubeProps } from "react-youtube";
import HeroSection from "@/app/Home/HeroSection";
import {HomeContainer, HomeMain} from "@/app/Home.styled";
import {WaveDivider} from "@/app/components/common/WaveDivider";
import FeaturesSection from "@/app/Home/FeaturesSection";
import PricingSection from "@/app/Home/PricingSection";
import CorretorJourneySection from "@/app/Home/CorretorJourneySection";
import FaqSection from "@/app/Home/FaqSection";

// type YouTubeErrorEvent = {
//     data: number;
// };



export default function Home() {

    return (
        <HomeContainer >
            <SimpleNavBar />
            <HomeMain>
                {/* Hero Section */}
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                    className={styles.heroSection}
                >
                    <HeroSection/>
                </motion.section>
                <WaveDivider/>

                {/* Funcionalidades em Destaque */}
                <div className={styles.sectionDivider}></div>
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                >
                    <FeaturesSection/>
                    <WaveDivider rotate/>
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
                    <PricingSection/>
                    <WaveDivider/>
                </motion.section>

                {/* Vídeo Demonstrativo */}
                <div className={styles.sectionDivider}></div>
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                >
                    <CorretorJourneySection/>
                    <WaveDivider rotate/>
                </motion.section>

                {/*/!* Vídeo Demonstrativo *!/*/}
                {/*<div className={styles.sectionDivider}></div>*/}
                {/*<motion.section*/}
                {/*    initial={{opacity: 0, y: 50}}*/}
                {/*    whileInView={{opacity: 1, y: 0}}*/}
                {/*    transition={{duration: 0.8}}*/}
                {/*    viewport={{once: true}}*/}
                {/*    className={styles.videoSection}*/}
                {/*>*/}
                {/*    <h2>Veja o CorretorLab em ação</h2>*/}
                {/*    <div className={styles.videoWrapper}>*/}
                {/*        <YouTube*/}
                {/*            videoId="cuJw8_D3zZk"*/}
                {/*            opts={{*/}
                {/*                width: '100%',*/}
                {/*                height: '500',*/}
                {/*                playerVars: {*/}
                {/*                    autoplay: 0,*/}
                {/*                    controls: 0,*/}
                {/*                    rel: 0,*/}
                {/*                    modestbranding: 1,*/}
                {/*                    disablekb: 1,*/}
                {/*                    iv_load_policy: 3,*/}
                {/*                    fs: 0,*/}
                {/*                    playsinline: 1,*/}
                {/*                },*/}
                {/*            }}*/}
                {/*            onError={(e: { data: number }) => {*/}
                {/*                console.error("Erro no player do YouTube:", e.data);*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</motion.section>*/}

                {/* FAQ */}
                <motion.section
                    initial={{opacity: 0, y: 50}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    viewport={{once: true}}
                >
                    <FaqSection/>
                </motion.section>

            </HomeMain>

            <footer className={styles.footer}>
                <p>&copy; 2024 CorretorLab. Todos os direitos reservados.</p>
                <div className={styles.footerLinks}>
                <Link href="/privacy_policy">Política de Privacidade</Link>
                    <Link href="/terms_of_service">Termos de Serviço</Link>
                </div>
            </footer>
        </HomeContainer>
    );
}
