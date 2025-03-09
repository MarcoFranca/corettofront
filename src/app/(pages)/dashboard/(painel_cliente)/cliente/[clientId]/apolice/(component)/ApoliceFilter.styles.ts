// styles/ApoliceFiltro.styles.ts
import styled from "styled-components";

export const FiltroContainer = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 20px;
`;

export const FiltroSelect = styled.select`
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.9rem;
    color: #334155;
    &:hover {
        border-color: #94a3b8;
    }
`;


interface TipoPillProps {
    active: boolean;
}

export const TipoPill = styled.button<TipoPillProps>`
    padding: 6px 16px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.gray.light};
    color: ${({ active }) => (active ? '#fff' : '#555')};
    font-weight: 500;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme, active }) => active ? theme.colors.primaryDark : theme.colors.gray.light};
    }
`;