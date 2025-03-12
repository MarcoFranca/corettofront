import styled from "styled-components";

export const SeguroVidaContainer = styled.div`
    flex-direction: column;
    padding: 18px;
    background-color: #f8f9fa;
    width: 100%;
    height: 100%;
    overflow: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    gap: 16px;
`;

export const Title = styled.h2`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.title};
    margin-bottom: 16px;
`;

export const CardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    padding: 16px;
`;

export const TableChartTable = styled.div`
    width: 100%;
    padding: 16px;
    overflow: auto;
    max-height: 350px;
`;

export const TableChart = styled.div`
    width: 30%;
    overflow: auto;
`;
