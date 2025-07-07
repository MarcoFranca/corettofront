// Estilos
import styled from "styled-components";

export const Container = styled.div`
    padding: 38px 32px 32px 32px;
    background: #f8fbff;
    min-height: 100vh;
`;
export const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 22px;
`;
export const InfoCard = styled.div<{ $clickable?: boolean }>`
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(4, 42, 117, 0.06);
    padding: 26px 18px 18px 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 120px;
    transition: box-shadow 0.22s;
    cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
    border: 1.5px solid transparent;
    &:hover {
        box-shadow: 0 4px 18px rgba(4, 42, 117, 0.09);
        border: 1.5px solid #33cccc;
    }
`;
export const CardTitle = styled.div`
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #042a75;
    gap: 10px;
    font-size: 15px;
`;
export const CardValue = styled.div`
    margin-top: 10px;
    font-size: 18px;
    color: #232d42;
    font-weight: 500;
    word-break: break-word;
    min-height: 24px;
`;
