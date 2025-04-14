// src/app/Home/PricingSection.tsx
'use client';
import {
    SectionWrapper,
    SectionTitle,
    CardContainer
} from './PricingSection.styled';
import PlanCard from "@/app/(pages)/(stripe)/planos/PlanCard";

export default function PricingSection() {
    return (
        <SectionWrapper>
            <SectionTitle>Plano Simples e Acessível</SectionTitle>
            <CardContainer>
                <PlanCard
                    nome="CorretorLab Pro"
                    descricao="Plano mensal com todos os recursos liberados"
                    preco="107,00"
                    beneficios={[
                        'Teste gratuito de 15 dias',
                        'Todos os recursos liberados',
                        'Sem limites de uso',
                        'Suporte exclusivo',
                    ]}
                    onSelect={() => window.location.href = '/register'}
                    destaque={true}
                />
            </CardContainer>
        </SectionWrapper>
    );
}
