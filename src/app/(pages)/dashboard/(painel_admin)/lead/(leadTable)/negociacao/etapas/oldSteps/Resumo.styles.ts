import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
`;

export const Header = styled.div`
  margin-bottom: 24px;
  h2 {
    font-size: 24px;
    font-weight: 600;
  }
`;

export const Section = styled.div`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
`;

export const InfoItem = styled.p`
  font-size: 16px;
  margin: 4px 0;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;

  button {
    background-color: #042a75;
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      background-color: #0541a8;
    }
  }
`;