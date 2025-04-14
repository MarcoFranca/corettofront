'use client';
import {
    HeroWrapper,
    HeroContent,
    HeroImage,
    Title,
    Subtitle,
    ButtonGroup,
    PrimaryButton,
    SecondaryButton,
    HeroContainer
} from './HeroSection.styled';
import Link from "next/link";
import HeroImg from '@/../public/assets/pages/site/hero.png';

export default function HeroSection() {
    return (
        <HeroWrapper>
            <HeroContainer>
                <HeroContent>
                    <Title>
                        CRM para corretores que querem <span>crescer</span>.
                    </Title>
                    <Subtitle>Simplifique suas vendas, acompanhe negociações em tempo real e conquiste mais clientes.</Subtitle>
                    <ButtonGroup>
                        <PrimaryButton as={Link} href="/register">Teste Grátis por 15 Dias</PrimaryButton>
                        <SecondaryButton as={Link} href="https://wa.me/5521990050220" target="_blank">Fale com Vendas</SecondaryButton>
                    </ButtonGroup>
                </HeroContent>
                <HeroImage src={HeroImg} alt="Hero" priority />
            </HeroContainer>
        </HeroWrapper>
    );
}
