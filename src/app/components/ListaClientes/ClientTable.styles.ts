import styled from 'styled-components';
import Link from "next/link";

export const TableContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 80vh;  /* 🔥 Define altura máxima */
    overflow-y: auto;   /* 🔥 Scroll vertical */
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;


export const Table = styled.table`
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: auto;
    color: ${({ theme }) => theme.colors.text};
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

export const TableRow = styled.tr`
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    &:nth-child(even) {
        background: ${({ theme }) => theme.colors.tableRowEven}; // 🔥 Alternância de cores
    }

    &:hover {
        background: ${({ theme }) => theme.colors.tableHover}; // ✨ Destaca ao passar o mouse
        transition: background-color 0.3s ease-in-out;
    }
`;

export const TippyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
`
export const TableHeader = styled.th`
    position: sticky;
    top: 0;
    background: ${({ theme }) => theme.colors.tableHeader};
    color: ${({ theme }) => theme.colors.tableHeaderText};
    text-transform: uppercase;
    font-weight: bold;
    padding: 14px;
    text-align: left;
    font-size: 0.9rem;
`;


export const TableData = styled.td`
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.9rem;
`;

export const SpanApolice = styled.span`
    display: flex;
    align-items: center;
    text-align: center;
    color: #0c2859;

`

export const TableActions = styled.td`
    display: flex;
    align-items: center;
    height: 100%;
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


export const Linked = styled(Link)`
    display: flex;
    gap: 8px;
    align-items: center;
    color: #0c2859;
    margin-bottom: 8px;
`;

export const Filters = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    align-items: center;

    select {
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 1rem;
        border: 1px solid #ddd;
        cursor: pointer;
        background-color: white;
        transition: 0.3s;

        &:hover {
            border-color: #007bff;
        }

        &:focus {
            outline: none;
            border-color: #0056b3;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }
    }

    input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 6px;
        flex-grow: 1;
    }
`;

export const ButtonContain = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    p{
        margin: 0;
    }
`

/** 🔹 Novo Estilo para Upload de Arquivo **/
export const FileInput = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 0.95rem;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: 0.3s;
    border: none;
    user-select: none;

    svg {
        font-size: 1.2rem;
    }

    &:hover {
        background-color: #0056b3;
        transform: scale(1.02);
    }

    input {
        display: none;
    }
`;

