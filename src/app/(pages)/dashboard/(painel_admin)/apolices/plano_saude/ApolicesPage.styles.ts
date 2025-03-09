import styled from 'styled-components';

export const PlanoSaudeContainer = styled.div`
    padding: 24px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

export const Title = styled.h2`
    font-size: 24px;
    color: ${({ theme }) => theme.colors.title};
    margin-bottom: 16px;
`;
