import styled from "styled-components";
import Image from 'next/image';

export const PageWrapper = styled.div`
    padding: 2rem 0;
    background: #f4f7fc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Title = styled.h1`
    font-size: 2.2rem;
    color: #042a75;
    margin-top: 1rem;
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #555;
  max-width: 600px;
  text-align: center;
  margin-bottom: 3rem;
`;

export const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    margin-top: 2rem;

    > div {
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        transition: transform 0.2s ease;
    }

    > div:hover {
        transform: scale(1.01);
    }
`;


export const DifferentialsSection = styled.div`
  margin-top: 4rem;
  text-align: center;
  max-width: 900px;
  padding: 2rem 1rem;
`;

export const DifferentialItem = styled.div`
  display: inline-block;
  margin: 1rem 2rem;
  font-size: 1rem;
  color: #333;

  svg {
    color: #33cccc;
    margin-bottom: 0.5rem;
  }
`;

export const FooterInfo = styled.p`
    margin-top: 4rem;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
`;


export const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-bottom: 1px solid #e4ebf5;

`;

export const TopBarContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem 1rem;
`;

export const TopBarContant = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`

export const TopBartext = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
`;


export const Logo = styled(Image)`
    height: 60px;
    width: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 12px;
`;


export const BackButton = styled.button`
  background: none;
  border: none;
  color: #042a75;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #007bff;
  }
`;
