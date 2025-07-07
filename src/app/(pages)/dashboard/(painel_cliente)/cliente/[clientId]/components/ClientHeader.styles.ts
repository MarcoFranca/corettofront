import {Cliente} from "@/types/interfaces";
import styled from "styled-components";
import {Button, Tag} from "antd";

export const getPipelineStage = (cliente: Cliente) =>
    cliente.pipeline_stage || "Lead";

export const HeaderWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 36px;
    padding-bottom: 24px;
    border-bottom: 1.5px solid #e0e6ef;
    margin-bottom: 34px;
    flex-wrap: wrap;

    @media (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 18px;
    }
`;

export const LeftBlock = styled.div`
    display: flex;
    gap: 26px;
    align-items: flex-start;
`;

export const MainInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const TopRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const Atalhos = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;
    @media (max-width: 900px) {
        width: 100%;
        gap: 10px;
        margin-top: 18px;
    }
`;

export const RightContainer = styled.div`
display: flex;
    gap: 32px;
`

export const Pipeline = styled.div`
    display: flex;
    gap: 7px;
    align-items: center;
    margin-bottom: 3px;
    font-size: 13px;
`;

export const EditButton = styled(Button)`
    position: relative;
    top: -8px;
    right: 0;
    box-shadow: 0 2px 8px #33cccc2b;
    background: #fff !important;
    border: 1.5px solid #33cccc;
    color: #042a75 !important;
    &:hover { color: #33cccc !important; }
`;

export const ActionButton = styled(Button)`
    position: relative;
    top: -8px;
    right: 0;
    box-shadow: 0 2px 8px #33cccc2b;
    background: #fff !important;
    border: 1.5px solid #33cccc;
    color: #042a75 !important;
    &:hover { color: #33cccc !important; }
`;

export const BadgeStatus = styled(Tag)`
    font-size: 13px;
    border-radius: 10px !important;
    padding: 0 12px;
    font-weight: 600;
`;
export const statusColors: Record<string, string> = {
    ativo: "green",
    lead: "blue",
    inativo: "orange",
    negociacao: "gold",
    "em negociação": "gold",
};

export const PageContainer = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 38px 24px 32px 24px;
  background: #f8fbff;
  min-height: 100vh;
`;

