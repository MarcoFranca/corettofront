import styled from "styled-components";

export const Card = styled.div<{ $destaque?: boolean }>`
  background: #fff;
  border-radius: 16px;
  box-shadow: ${({ $destaque }) =>
          $destaque
        ? '0 0 15px rgba(51, 204, 204, 0.4)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  padding: 24px;
  max-width: 360px;
  width: 100%;
  border: ${({ $destaque }) => ($destaque ? '2px solid #33cccc' : 'none')};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const Title = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 8px;
  color: #042a75;
`;

export const Description = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 16px;
`;

export const Price = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

export const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

export const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  margin-bottom: 8px;

  svg {
    color: #33cc99;
  }
`;

export const Button = styled.button`
  background: #33cccc;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: #2ab8b8;
  }
`;

export const Tag = styled.span`
  background: #ffe135;
  color: #000;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  margin-bottom: 12px;
  display: inline-block;
`;

export const Logo = styled.img`
  height: 50px;
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
