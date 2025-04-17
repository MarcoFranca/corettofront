// components/negociacao/NegociacaoReunioesTab.styles.ts
'use client';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: auto;
`;

export const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h3 {
        margin: 0;
    }
`;

export const TableContainer = styled.div`
    flex: 1;
    overflow: hidden;
    height: 100%;
    min-height: 300px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
`;


export const Buttons = styled.div`
    display: flex;
    gap: 1rem;
`