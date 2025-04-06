import styled from 'styled-components';
import { Tabs, Button } from 'antd';

export const Container = styled.div`
    padding: 2rem;
    background-color: #fff;
    min-height: 100%;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

export const HeaderInfo = styled.div`
    h2 {
        margin: 0;
        font-size: 1.8rem;
        color: #042a75;
    }

    p {
        margin: 0.2rem 0 0;
        font-size: 1rem;
        color: #666;
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    .ant-select {
        min-width: 220px;
    }

    .ant-btn-primary {
        background-color: #042a75;
        border-color: #042a75;

        &:hover,
        &:focus {
            background-color: #033192;
            border-color: #033192;
        }
    }
`;

export const StyledTabs = styled(Tabs)`
    .ant-tabs-nav {
        margin-bottom: 1rem;

        .ant-tabs-tab {
            font-weight: 500;
        }

        .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #042a75;
        }

        .ant-tabs-ink-bar {
            background-color: #042a75;
        }
    }
`;

export const Section = styled.div`
    padding: 1.5rem;
    background-color: #f5f7fa;
    border-radius: 10px;

    h3 {
        margin-top: 0;
        font-size: 1.2rem;
        color: #042a75;
    }

    p {
        font-size: 0.95rem;
        margin: 0.3rem 0;
    }
`;

export const StyledButton = styled(Button)`
    margin-top: 1.5rem;
    font-weight: 500;
`;
