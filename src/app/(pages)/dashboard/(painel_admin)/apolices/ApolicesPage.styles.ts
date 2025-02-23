import styled from "styled-components";

export const ApolicesContainer = styled.div`
    padding: 24px;
    height: 100%;
    background-color: #f5f7fa;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const Title = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
`;

export const StyledButton = styled.button`
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background-color: #4CAF50;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #43a047;
    }
`;

export const FilterContainer = styled.div`
    margin-bottom: 24px;
`;

export const ContentContainer = styled.div`
    border-radius: 8px;
    background-color: #fff;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    min-height: 300px;
`;
