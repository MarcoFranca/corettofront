import styled from "styled-components";
import Link from "next/link";

// Container geral da dashboard
export const DashboardContainer = styled.div`
    padding: 2rem;
    min-height: 100%;
    background-color: #f5f7fa;
    gap: 1rem;
    overflow: auto;
`;

// Header com título e botão
export const HeaderBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

// Botão com estilo de link
export const ButtonLink = styled(Link)`
    text-decoration: none;

    button {
        font-weight: 500;
    }
`;

// Grid de gráficos
export const GraphSection = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`;

// Container de cards de gráficos
export const CardsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    width: 100%;
`;
