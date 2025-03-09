import styled from "styled-components";

export const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
`;

export const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
`;

export const Card = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.05);
    }

    h3 {
        margin-bottom: 5px;
        color: #333;
    }

    p {
        font-size: 18px;
        font-weight: bold;
        color: #007bff;
    }
`;

export const IconWrapper = styled.div`
    margin-bottom: 10px;
    color: #007bff;
`;
