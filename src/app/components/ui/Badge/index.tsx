// Badge.tsx
import React from 'react';
import styled from 'styled-components';

export type StatusType =
    | 'lead'
    | 'negociacao'
    | 'ativo'
    | 'nova_negociacao'
    | 'inativo'
    | 'recusado'
    | 'reativacao_pendente'
    | 'cancelado';

type BadgeProps = {
    children: React.ReactNode;
    variant?: 'solid' | 'outline';
    status?: StatusType;
    className?: string; // Suporte para classes externas
};

// 🔥 Centralizamos as cores e descrições
const STATUS_DETAILS: Record<StatusType, { label: string; color: string; textColor?: string; description: string }> = {
    lead: { label: "Lead", color: '#FFA500', textColor: '#fff', description: 'Cliente potencial que ainda não fechou negócio.' },
    negociacao: { label: "Em Negociação", color: '#1E90FF', textColor: '#fff', description: 'Cliente em contato e negociação ativa.' },
    ativo: { label: "Cliente Ativo", color: '#4fe67d', textColor: '#fff', description: 'Cliente que possui um serviço ativo.' },
    nova_negociacao: { label: "Nova Negociação", color: '#4682B4', textColor: '#fff', description: 'Cliente ativo, mas negociando novos produtos.' },
    inativo: { label: "Cliente Inativo", color: '#FF4500', textColor: '#fff', description: 'Cliente que já teve um serviço, mas não está mais ativo.' },
    recusado: { label: "Recusado", color: '#A52A2A', textColor: '#fff', description: 'Cliente recusou a oferta após a negociação.' },
    reativacao_pendente: { label: "Reativação Pendente", textColor: '#c63939', color: '#FFD700', description: 'Cliente inativo com possibilidade de retorno.' },
    cancelado: { label: "Cancelado", color: '#8B0000', textColor: '#fff', description: 'Cliente que cancelou os serviços recentemente.' },
};


const StyledBadge = styled.span<BadgeProps>`
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 9999px;
    background-color: ${({ status }) => (status ? STATUS_DETAILS[status].color : '#e2e8f0')};
    color: ${({ status }) => (status && STATUS_DETAILS[status].textColor ? STATUS_DETAILS[status].textColor : '#1a202c')};
    border: ${({ variant }) => (variant === 'outline' ? '1px solid #a0aec0' : 'none')};
`;

const Badge: React.FC<BadgeProps> = ({ children, variant = 'solid', status, className }) => {
    return <StyledBadge variant={variant} status={status} className={className}>{children}</StyledBadge>;
};

export { Badge, STATUS_DETAILS }; // 🔥 Exportamos `STATUS_DETAILS` para ser reutilizado em outras partes do código
