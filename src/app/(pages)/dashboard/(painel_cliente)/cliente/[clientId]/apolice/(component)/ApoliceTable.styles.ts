import styled from "styled-components";

// 🔹 Container da Tabela
export const TableContainer = styled.div`
    overflow-x: auto;
    margin-bottom: 20px;
`;

// 🔹 Tabela Estilizada
export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
    text-align: left;
`;

// 🔹 Cabeçalho da Tabela
export const TableHeader = styled.th`
    background-color: #007bff;
    color: white;
    padding: 10px;
    text-align: left;
`;

// 🔹 Célula da Tabela
export const TableCell = styled.td`
    padding: 10px;
    border: 1px solid #ddd;
`;
