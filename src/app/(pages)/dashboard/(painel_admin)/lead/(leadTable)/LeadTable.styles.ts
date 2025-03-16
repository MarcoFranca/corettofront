import styled from "styled-components";

export const TableContainer = styled.div`
    padding: 16px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 60px;

    h2 {
        font-size: 20px;
        color: #333;
        margin-bottom: 12px;
    }

    .ant-table {
        border-radius: 8px;
        overflow: hidden;
    }

    .ant-table-thead > tr > th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    .ant-table-tbody > tr > td {
        padding: 12px;
    }
`;
