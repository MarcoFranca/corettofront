import styled from "styled-components";

export const TableContainer = styled.div`
    position: relative;
    width: 100%;
    max-height: 61vh;
    overflow-y: auto;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.text};
`;

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

export const TableRow = styled.tr`
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:nth-child(even) {
        background: ${({ theme }) => theme.colors.tableRowEven};
    }

    &:hover {
        background: ${({ theme }) => theme.colors.tableHover};
        transition: background-color 0.3s ease-in-out;
    }
`;

export const TableData = styled.td`
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.9rem;
`;

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
