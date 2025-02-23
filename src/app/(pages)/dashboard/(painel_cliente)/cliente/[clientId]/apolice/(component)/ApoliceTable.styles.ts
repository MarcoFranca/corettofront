import styled from "styled-components";

export const TableContainer = styled.div`
    position: relative;
    width: 100%;
    max-height: 80vh;  /* 🔥 Define altura máxima */
    overflow-y: auto;   /* 🔥 Scroll vertical */
    border-radius: 8px;
    background-color: white;
    //padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;


export const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-radius: 8px;
    overflow: auto;
    background-color: #ffffff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.th`
    position: sticky;
    top: 0;
    background-color: #f1f5f9;
    color: #334155;
    font-weight: bold;
    padding: 14px;
    text-align: left;
    font-size: 0.9rem;
`;

export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f8fafc;
    }

    &:hover {
        background-color: #e2e8f0;
        transition: background-color 0.3s ease-in-out;
    }
`;

export const TableData = styled.td`
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.9rem;
`;

export const TableActions = styled.td`
    display: flex;
    gap: 8px;
    padding: 10px;
`;

export const DetailsButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

// 🔥 Botão de Visualizar Arquivo
export const ViewButton = styled.button`
    background-color: #17a2b8;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #138496;
    }

    &:disabled {
        background-color: #adb5bd;
        cursor: not-allowed;
    }
`;

// 🗑 Botão de Deletar
export const DeleteButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #c82333;
    }
`;
// Badge para os status
export const StatusBadge = styled.span<{ color: string }>`
    display: inline-block;
    padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: bold;
    color: white;
    background-color: ${(props) => props.color};
    border-radius: 20px;
    text-transform: capitalize;
`;
