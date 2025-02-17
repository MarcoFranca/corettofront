import styled from 'styled-components';

export const ProgressContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 20px;
  overflow: hidden;
  height: 12px;
  margin-bottom: 20px;
`;

export const ProgressBar = styled.div<{ value: number }>`
  height: 100%;
  width: ${props => props.value}%;
  background-color: #4caf50;
  transition: width 0.3s ease-in-out;
`;

export const ProgressLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-top: 5px;
  color: #333;
`;
