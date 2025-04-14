import styled from 'styled-components';
import Image from 'next/image';

export const HeroWrapper = styled.section`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    padding: 6rem 2rem 4rem;
    background: linear-gradient(135deg, #eef3fb 0%, #dff4ff 100%);
    border-bottom: 1px solid #dce6f1;
    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

export const HeroContainer = styled.div`
    display: flex;
    max-width: 1600px;
    gap: 3rem;
`;

export const HeroContent = styled.div`
    max-width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
`;


export const Title = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.2;
    color: #042a75;

    span {
        color: #33cccc;
    }

    @media (max-width: 768px) {
        font-size: 2.2rem;
    }
`;


export const Subtitle = styled.p`
    font-size: 1.2rem;
    color: #333;
    line-height: 1.8;
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

export const PrimaryButton = styled.a`
    background-color: #33cccc;
    color: #fff;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    box-shadow: 0 4px 10px rgba(51, 204, 204, 0.4);
    transition: 0.3s ease;

    &:hover {
        background-color: #2ab8b8;
        box-shadow: 0 6px 12px rgba(51, 204, 204, 0.5);
    }
`;


export const SecondaryButton = styled.a`
    background: transparent;
    border: 2px solid #07011e;
    color: #07011e;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    transition: 0.3s ease;

    &:hover {
        background: rgba(198, 165, 46, 0.9);
        color: #fff;
        border-color: transparent;
    }
`;

export const HeroImage = styled(Image)`
    max-width: 50%;
    height: auto;
    border-radius: 10px;
`;

