import styled from "styled-components";

export const ClientesTableContainer = styled.div`
    background: #fff;
    border-radius: 10px;
    padding: 0;
    box-shadow: 0 2px 10px 0 #e6eef7;

    .ant-table-thead > tr > th {
        background: #fafbfc;
        font-weight: 600;
        font-size: 15px;
        color: #222;
        border-bottom: 1px solid #f0f0f0;
    }
    .ant-table-tbody > tr > td {
        font-size: 14px;
        color: #222;
        background: #fff;
    }
    .ant-table-tbody > tr:hover > td {
        background: #f5f7fa;
    }
    .sem-cadastro {
        color: #bbb;
        font-style: italic;
    }
    .ant-tag {
        font-size: 13px !important;
        padding: 0 8px !important;
        border-radius: 4px;
        line-height: 20px;
    }
`;

