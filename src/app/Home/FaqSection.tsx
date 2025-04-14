'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {FaqWrapper, QuestionItem, QuestionTitle, Answer, Badge, FaqContainer} from './FaqSection.styled';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const faqs = [
    {
        question: 'Posso cancelar a qualquer momento?',
        answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento diretamente pelo painel, sem burocracia ou taxas escondidas.',
        common: true,
    },
    {
        question: 'Preciso de cartão de crédito para ativar o teste gratuito?',
        answer: 'Sim, o teste de 15 dias exige um cartão válido para ativação, mas você pode cancelar a qualquer momento antes do vencimento.',
        common: false,
    },
    {
        question: 'O sistema envia mensagens pelo WhatsApp?',
        answer: 'Atualmente, o sistema oferece atalhos que facilitam o envio de mensagens pelo WhatsApp, mas não permite o envio direto dentro da plataforma.',
        common: true,
    },
    // {
    //     question: 'Posso usar o CorretorLab no celular?',
    //     answer: 'Sim! O sistema é 100% responsivo e pode ser acessado normalmente pelo navegador do seu celular ou tablet.',
    //     common: false,
    // },
    {
        question: 'Tem suporte se eu precisar de ajuda?',
        answer: 'Sim! Você terá acesso ao nosso suporte exclusivo por e-mail e WhatsApp durante todo o período da assinatura.',
        common: true,
    },
    {
        question: 'Quantos usuários posso cadastrar?',
        answer: 'Atualmente o plano é individual. Em breve, planos multiusuário estarão disponíveis.',
        common: false,
    },
];


export default function FaqSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <FaqContainer >
            <FaqWrapper>
                <h2>Perguntas Frequentes</h2>
                {faqs.map((faq, index) => (
                    <QuestionItem key={index} onClick={() => toggle(index)} active={activeIndex === index}>
                        <QuestionTitle>
                            <AiOutlineQuestionCircle size={20} />
                            {faq.question}
                            {faq.common && <Badge>Dúvida comum</Badge>}
                        </QuestionTitle>
                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Answer>{faq.answer}</Answer>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </QuestionItem>
                ))}
            </FaqWrapper>
        </FaqContainer>
    );
}
