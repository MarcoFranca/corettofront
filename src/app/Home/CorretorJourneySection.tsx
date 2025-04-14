// 📁 src/app/Home/CorretorJourneySection.tsx
'use client';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUserPlus, FaRegCalendarCheck, FaHandshake, FaChartLine } from 'react-icons/fa';

const steps = [
    { icon: <FaUserPlus size={28} />, title: 'Cadastro Rápido', desc: 'Crie sua conta e comece em minutos.' },
    { icon: <FaRegCalendarCheck size={28} />, title: 'Organize Leads', desc: 'Visualize e acompanhe negociações.' },
    { icon: <FaHandshake size={28} />, title: 'Feche Vendas', desc: 'Tenha controle total do funil.' },
    { icon: <FaChartLine size={28} />, title: 'Cresça com Consistência', desc: 'Expanda sua corretora com processos eficientes.' },
];

export default function CorretorJourneySection() {
    return (
        <Wrapper>
            <Title>Transforme sua jornada como corretor</Title>
            <StepsWrapper>
                {steps.map((step, index) => (
                    <StepItem
                        as={motion.div}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        key={index}
                    >
                        <StepIcon>{step.icon}</StepIcon>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDesc>{step.desc}</StepDesc>
                    </StepItem>
                ))}
            </StepsWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.section`
  background: #f5f9ff;
  padding: 5rem 2rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #042a75;
  margin-bottom: 3rem;
  font-weight: 700;
`;

const StepsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const StepItem = styled.div`
  max-width: 240px;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
`;

const StepIcon = styled.div`
  color: #33cccc;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.1rem;
  color: #042a75;
  margin-bottom: 0.5rem;
`;

const StepDesc = styled.p`
  font-size: 0.95rem;
  color: #555;
`;
