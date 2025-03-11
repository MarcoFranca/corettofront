import styled from "styled-components";

export const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
`;

export const KpiCard = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: 0.3s;

    .icon {
        font-size: 24px;
        color: #007bff;
    }

    .content {
        h3 {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 4px;
        }

        p {
            font-size: 18px;
            font-weight: bold;
            color: #343a40;
        }
    }

    &.clickable {
        cursor: pointer;
        &:hover {
            background: #e9f5ff;
        }
    }
`;

export const CardCharts = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 100%;
    min-height: 280px;

    h3 {
        font-size: 16px;
        color: #495057;
        margin-bottom: 12px;
    }
`;
