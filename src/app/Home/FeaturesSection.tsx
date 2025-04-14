'use client';
import {
    SectionWrapper,
    SectionTitle,
    FeaturesGrid,
    FeatureCard,
    FeatureCardTitle,
    FeatureCardDescription, Badge,
} from './FeaturesSection.styled';
import Lottie from 'react-lottie-player';
import businessPlan from '@/../public/lotties/business-plan.json';
import calendar from '@/../public/lotties/calendar.json';
import automacao from '@/../public/lotties/automacao.json';
import { useState } from 'react';

const features = [
    {
        title: 'Organização Avançada',
        desc: 'Organize leads e clientes com etapas personalizadas de negociação.',
        animation: businessPlan,
        highlight: true,
    },
    {
        title: 'Agenda Integrada',
        desc: 'Integração direta com Google Agenda e Google Meet.',
        animation: calendar,
    },
    {
        title: 'Automação de Tarefas',
        desc: 'Automatize tarefas repetitivas e foque no que realmente importa.',
        animation: automacao,
    },
];



export default function FeaturesSection() {
    const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
    const [hasMouseLeft, setHasMouseLeft] = useState<{ [key: number]: boolean }>({});
    const [animationKey, setAnimationKey] = useState<{ [key: number]: number }>({});

    const handleMouseEnter = (index: number) => {
        setAnimationKey((prev) => ({ ...prev, [index]: Math.random() }));
        setIsPlaying((prev) => ({ ...prev, [index]: true }));
        setHasMouseLeft((prev) => ({ ...prev, [index]: false }));
    };

    const handleMouseLeave = (index: number) => {
        setHasMouseLeft((prev) => ({ ...prev, [index]: true }));
    };

    const handleAnimationComplete = (index: number) => {
        if (hasMouseLeft[index]) {
            setIsPlaying((prev) => ({ ...prev, [index]: false }));
        }
    };

    return (
        <SectionWrapper>
            <SectionTitle>Funcionalidades que você vai amar</SectionTitle>
            <FeaturesGrid>
                {features.map((item, index) => (
                    <FeatureCard
                        key={index}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                    >
                        {item.highlight && <Badge>Novo</Badge>}
                        <FeatureCardTitle>
                            <Lottie
                                key={animationKey[index]}
                                loop={false}
                                animationData={item.animation}
                                play={isPlaying[index] || false}
                                onComplete={() => handleAnimationComplete(index)}
                            />
                        </FeatureCardTitle>
                        <h3>{item.title}</h3>
                        <FeatureCardDescription>{item.desc}</FeatureCardDescription>
                    </FeatureCard>
                ))}
            </FeaturesGrid>
        </SectionWrapper>
    );
}
