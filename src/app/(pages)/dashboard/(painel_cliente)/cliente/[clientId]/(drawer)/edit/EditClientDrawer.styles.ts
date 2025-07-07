import styled from "styled-components";

export const Grid2 = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

export const FormSection = styled.div`
    margin-bottom: 24px;
`;

export const DrawerTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

export const VIP = styled.span<{ $vip?: boolean }>`
    color: ${({ $vip }) => ($vip ? "#ffd700" : "#888")};
    font-weight: 700;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const DrawerFooter = styled.div`
  text-align: right;
  padding: 16px 0 0;
  background: #fff;
  border-top: 1px solid #e5e9f1;
`;

export const UploadHint = styled.div`
  font-size: 0.95rem;
  color: #888;
  margin-top: 4px;
`;


export const SummaryHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 22px;
    padding: 24px 24px 8px 24px;
    background: #f8fbff;
    border-bottom: 1.5px solid #e3ebf6;
    position: sticky;
    top: 0;
    z-index: 2;
`;

export const SummaryMainInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    & > div:first-child {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }
`;

export const SummaryActions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    min-width: 140px;
`;

export const NomeCliente = styled.span`
    font-size: 22px;
    font-weight: 600;
    color: #042a75;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StatusTag = styled.div`
    margin-top: 4px;
    display: flex;
    gap: 8px;
    align-items: center;
`;
