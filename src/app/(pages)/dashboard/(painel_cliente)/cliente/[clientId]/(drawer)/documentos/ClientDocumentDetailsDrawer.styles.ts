import styled from "styled-components";

export const InfoLine = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    font-size: 16px;
    gap: 12px;
`;
export const DocList = styled.div`
    margin-top: 20px;
    background: #f8fbff;
    border-radius: 13px;
    padding: 18px;
    box-shadow: 0 3px 10px #042a7532;
`;
export const DocItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #e6f0fb;
    &:last-child { border-bottom: none; }
`;
export const DocLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 13px;
`;

export const DocActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;