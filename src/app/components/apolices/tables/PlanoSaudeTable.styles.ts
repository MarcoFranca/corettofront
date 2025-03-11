import styled from "styled-components";

export const TableContainer = styled.div`
    position: relative;
    width: 100%;
    max-height: 61vh;
    overflow: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: ${({ theme }) => theme.colors.background};

`;

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    color: ${({ theme }) => theme.colors.text};


    th, td {
        padding: 8px;
        border-bottom: 1px solid #e9ecef;
    }

    th {
        background: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        font-weight: bold;
    }

    tbody tr:nth-child(even) {
        background-color: #f8f9fc;
    }

    tbody tr:hover {
        background-color: #e9f5ff;
        transition: 0.3s;
    }
`;

export const TableHeader = styled.th`
    background: ${({ theme }) => theme.colors.tableHeader};
    color: ${({ theme }) => theme.colors.tableHeaderText};
    font-weight: 600;
`;

export const TableRow = styled.tr`
    &:hover {
        background: #e9f5ff;
    }
`;

export const TableData = styled.td`
    font-size: 14px;
    color: #212529;
`;

export const TableDataContent = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`


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
