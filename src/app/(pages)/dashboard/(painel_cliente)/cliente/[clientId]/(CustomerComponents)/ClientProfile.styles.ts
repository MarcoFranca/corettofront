import styled from 'styled-components';

// Container geral
export const ProfileContainer = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    background: #fff;
    padding: 32px 16px 24px 16px;
    border-radius: 24px;
    box-shadow: 0 2px 12px rgba(4,42,117,0.08);
`;

// Header centralizado
export const ProfileHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
`;

export const ProfileImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    background: #f3f8ff;
    margin-bottom: 12px;
    text-align: center;
    align-self: center;
    justify-self: center;
`;

export const HeaderText = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        font-size: 2rem;
        font-weight: bold;
        color: #042a75;
        margin: 0;
    }
`;

export const StatusBadge = styled.p<{ color?: string }>`
    margin-top: 8px;
    font-weight: bold;
    color: #fff;
    background-color: ${({ color }) => color || '#042a75'};
    padding: 6px 18px;
    border-radius: 16px;
    font-size: 1rem;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const CreationDate = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #999;
  margin-bottom: 24px;
`;

// Abas horizontais
export const TabsContainer = styled.div`
    display: flex;
    border-bottom: 2px solid #eef3fa;
    margin-bottom: 24px;
    gap: 2px;
`;

export const TabButton = styled.button<{ selected?: boolean }>`
  background: ${({ selected }) => (selected ? '#fff' : '#f6f9fd')};
  border: none;
  border-bottom: ${({ selected }) => (selected ? '2px solid #33cccc' : '2px solid transparent')};
  color: ${({ selected }) => (selected ? '#042a75' : '#8fa3bf')};
  font-weight: 600;
  font-size: 1.09rem;
  padding: 12px 24px;
  border-radius: 16px 16px 0 0;
  cursor: pointer;
  margin-right: 4px;
  transition: all .18s;

  &:hover {
    background: #eaf7fa;
    color: #042a75;
  }
`;

// Painel da aba
export const TabPanel = styled.div`
    padding: 24px 4px;
`;

export const SectionContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
`;

export const InfoCard = styled.div`
    flex: 2;
    min-width: 320px;
    max-width: 100%;
    padding: 16px 18px 12px 18px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 10px rgba(4,42,117,0.04);
    margin-bottom: 6px;
`;

export const AddObservationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #33cccc;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 18px;

  &:hover {
    background: #042a75;
  }
`;

export const ObservationDisplay = styled.div`
    margin-top: 16px;
    padding: 10px;
    border-radius: 6px;
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    color: #333;
    max-height: 150px;
    overflow-y: auto;
`;

export const Error = styled.p`
    color: red;
    font-weight: bold;
    margin-top: 10px;
`;
