// styles/ApoliceFiltro.styles.ts
import styled, { css } from "styled-components";

const fadeMask = css`
  mask-image: ${`linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)`};
  -webkit-mask-image: ${`linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)`};
`;


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
    min-width: 120px;
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.gray.Light};
    color: ${({ active }) => (active ? '#fff' : '#555')};
    font-weight: 500;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme, active }) => active ? theme.colors.title : theme.colors.gray.Light};
    }
`;

export const TipoPillContainer = styled.div`
    position: relative;
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 16px;
    scroll-behavior: smooth;

    ${fadeMask};

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 768px) {
        padding: 8px;
        mask-image: ${`linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)`};
        -webkit-mask-image: ${`linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)`};
    }
`;
