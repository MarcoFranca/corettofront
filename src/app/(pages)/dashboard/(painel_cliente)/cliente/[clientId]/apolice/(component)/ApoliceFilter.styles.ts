// styles/ApoliceFiltro.styles.ts
import styled from "styled-components";

export const FiltroContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
`;

export const FiltroSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.9rem;
  color: #334155;
  &:hover {
    border-color: #94a3b8;
  }
`;
