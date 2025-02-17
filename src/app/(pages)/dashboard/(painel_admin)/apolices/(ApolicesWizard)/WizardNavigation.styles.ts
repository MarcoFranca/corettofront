import styled from 'styled-components';

export const NavigationContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;

  .button-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 16px;
    gap: 12px;
  }
`;

export const StepLabel = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
`;
