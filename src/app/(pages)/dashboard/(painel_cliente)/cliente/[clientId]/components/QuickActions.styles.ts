import styled from "styled-components";
import {Button} from "antd";

export const QuickActionsWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    /* z-index opcional para evitar sobreposição */
`;

export const FloatingActions = styled.div<{ $show: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: absolute;
    left: -16px;
    right: 0;
    width: fit-content;
    top: 50px;
    background: #fff;
    padding: 8px 18px;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(4, 42, 117, 0.09);
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    pointer-events: ${({ $show }) => ($show ? "auto" : "none")};
    transition: opacity 0.28s, left 0.2s;
    @media (max-width: 900px) {
        left: 0;
        top: 54px;
        transform: none;
        flex-direction: column;
        padding: 12px;
    }
`;

export const QuickActionBtn = styled(Button)`
    border-radius: 50% !important;
    width: 40px;
    padding: 8px;
    font-size: 22px;
    background: #fff;
    border: 1.5px solid #33cccc;
    color: #042a75 !important;
    box-shadow: 0 2px 8px #33cccc22;
    &:hover { color: #33cccc !important; }
`;