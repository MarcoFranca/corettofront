import styled from 'styled-components';
import Link from "next/link";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f2f7fd;
    min-height: 100%;
    overflow: auto;
`;
export const Linked = styled(Link)`
    display: flex;
    gap: 8px;
    align-items: center;
    color: #0c2859;
`

export const Filters = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 20px;

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


export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 12px;
        border: 1px solid #ddd;
        text-align: left;
    }

    th {
        background-color: #f5f5f5;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tr:hover {
        background-color: #f1f1f1;
    }
`;

export const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    svg {
        cursor: pointer;
        transition: 0.3s;
    }

    svg:hover {
        color: #007bff;
    }
`;
