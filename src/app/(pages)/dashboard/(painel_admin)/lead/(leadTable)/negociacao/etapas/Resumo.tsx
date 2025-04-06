import React from 'react';
import { Container, Header, Section, SectionTitle, InfoItem, ActionsRow } from './Resumo.styles';
import { FaCalendarAlt, FaRegCommentDots, FaTasks } from 'react-icons/fa';

const Resumo: React.FC = () => {
    return (
        <Container>
            <Header>
                <h2>Resumo da Negociação</h2>
            </Header>

            <Section>
                <SectionTitle>Informações Principais</SectionTitle>
                <InfoItem><strong>Status:</strong> Marcar Reunião</InfoItem>
                <InfoItem><strong>Temperatura:</strong> Morno</InfoItem>
                <InfoItem><strong>Última atualização:</strong> 05/04/2025</InfoItem>
            </Section>

            <Section>
                <SectionTitle>Ações Rápidas</SectionTitle>
                <ActionsRow>
                    <button><FaTasks /> Atividades</button>
                    <button><FaRegCommentDots /> Observações</button>
                    <button><FaCalendarAlt /> Reuniões</button>
                </ActionsRow>
            </Section>
        </Container>
    );
};

export default Resumo;