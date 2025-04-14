import styled from 'styled-components';

export const SectionWrapper = styled.section`
    padding: 5rem 2rem;
    background-color: #f5f9ff;
    text-align: center;
`;

export const SectionTitle = styled.h2`
    font-size: 2.4rem;
    color: #042a75;
    margin-bottom: 3rem;
    font-weight: 700;
`;

export const FeaturesGrid = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }

`;

export const FeatureCard = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    background-color: white;
    border-radius: 12px;
    padding: 2rem 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
    }

    h3 {
        color: #042a75;
        margin-top: 1rem;
        font-size: 1.25rem;
        transition: color 0.3s ease;
    }

    &:hover h3 {
        color: #33cccc;
    }
`;

export const FeatureCardTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    
`;

export const FeatureCardDescription = styled.p`
    margin-top: 1rem;
    color: #555;
    padding: 0 1rem;
    font-size: 1rem;
    line-height: 1.6;
`;

export const Badge = styled.span`
    background-color: #33cccc;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 12px;
    position: absolute;
    top: 1rem;
    right: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
