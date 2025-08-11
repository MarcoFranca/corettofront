// src/app/Home/PricingSection.styled.ts
import styled from 'styled-components';

export const SectionWrapper = styled.section`
    padding: 6rem 2rem;
    background: linear-gradient(135deg, #eef3fb 0%, #dff4ff 100%);
    text-align: center;
`;

export const SectionTitle = styled.h2`
    font-size: 2.4rem;
    color: #042a75;
    margin-bottom: 3rem;
    font-weight: 700;
`;

export const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 24px;  
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;
