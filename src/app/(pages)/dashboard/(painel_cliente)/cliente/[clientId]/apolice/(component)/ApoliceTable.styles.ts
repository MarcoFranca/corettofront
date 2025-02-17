// styles/ApolicesTable.styles.ts
import styled from "styled-components";

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
`;

export const TableHeader = styled.th`
    background-color: #f1f5f9;
    color: #334155;
    font-weight: 600;
    padding: 12px;
    text-align: left;
    font-size: 0.9rem;
`;

export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f8fafc;
    }
`;

export const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
`;


