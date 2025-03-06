import styled from "styled-components";

export const CardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

export const Card = styled.div`
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const CardTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h3 {
        margin: 0;
    }
`;