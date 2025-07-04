import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    /* Estilização global */
    * {
        scrollbar-width: thin;
        scrollbar-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.background};
    }

    /* Webkit (Chrome, Edge, Safari) */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;

    }

    ::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.background};
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primary};
        border-radius: 10px;
        transition: background 0.3s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.colors.secondary};
    }
    .ja-foi-cliente-row > td:first-child {
        border-left: 6px solid #042a75 !important;
    }
    .negociacao-sem-carteira-row > td:first-child {
        border-left: 6px solid #ffd420 !important;
    }


`;
