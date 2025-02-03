// Badge.tsx
import React from 'react';
import styled from 'styled-components';

type BadgeProps = {
    children: React.ReactNode;
    variant?: 'solid' | 'outline';
    status?: 'lead' | 'negociacao' | 'ativo' | 'nova_negociacao' | 'inativo' | 'recusado' | 'reativacao_pendente' | 'cancelado';
    className?: string; // Adicionando suporte para className opcional
};

const StyledBadge = styled.span<BadgeProps>`
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 9999px;
    background-color: ${({ status }) => {
        switch (status) {
            case 'lead':
                return '#c3dafe';
            case 'negociacao':
                return '#fbd38d';
            case 'ativo':
                return '#9ae6b4';
            case 'nova_negociacao':
                return '#d6bcfa';
            case 'inativo':
                return '#e2e8f0';
            case 'recusado':
                return '#feb2b2';
            case 'reativacao_pendente':
                return '#faf089';
            case 'cancelado':
                return '#a0aec0';
            default:
                return '#e2e8f0';
        }
    }};
    color: ${({ status }) => (status === 'cancelado' ? '#4a5568' : '#1a202c')};
    border: ${({ variant }) => (variant === 'outline' ? '1px solid #a0aec0' : 'none')};
`;

const Badge: React.FC<BadgeProps> = ({ children, variant = 'solid', status, className }) => {
    return <StyledBadge variant={variant} status={status} className={className}>{children}</StyledBadge>;
};

export default Badge;