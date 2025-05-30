// styled-components
import { Drawer as AntDrawer } from 'antd';
import styled, { keyframes } from "styled-components";

// Animação de fade suave
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const StyledDrawer = styled(AntDrawer)`
    .ant-drawer-body {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }
`;


export const DrawerFlex = styled.div`
    display: flex;
    height: 100%; // ajustável, mas deixa bonito no desktop
    width: 100%;
    min-height: 480px;
    min-width: 720px;
    background: #f9fafb;
`;

export const Sidebar = styled.div`
    min-width: 260px;
    max-width: 320px;
    background: #f3f4f6;
    border-right: 1.5px solid #e5e7eb;
    padding: 18px 12px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    height: 100%;
    overflow-y: auto;
`;

export const ThreadList = styled.ul`
    margin: 0;
    padding: 0;
    flex: 1;
    list-style: none;
    overflow-y: auto;
`;

export const ThreadItem = styled.li<{ selected: boolean }>`
    background: ${({ selected }) => (selected ? "#e0eaff" : "transparent")};
    font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
    border-radius: 8px;
    cursor: pointer;
    padding: 10px 12px;
    margin-bottom: 8px;
    transition: background 0.12s;
    &:hover {
        background: #e7eafc;
    }
`;
export const MainChat = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    background: #fff;
    margin: 0;
    position: relative;
    box-shadow: 0 2px 16px 0 #0000000a;
    overflow: hidden;
`;



export const ChatContainer = styled.div`
        flex-grow: 1;
        padding: 32px;
        display: flex;
        width: 100%;
        background-color: #f7fcfd;
        flex-direction: column;
        gap: 18px;
        scroll-behavior: smooth;
        overflow-y: auto;

`;

export const MessageRow = styled.div<{ role: "user" | "assistant" }>`
    display: flex;
    align-items: flex-end;
    justify-content: ${({ role }) => (role === "user" ? "flex-end" : "flex-start")};
    gap: 12px;
`;

export const MessageBubble = styled.div<{ role: "user" | "assistant" }>`
    position: relative;
    background-color: ${({ role }) => (role === "user" ? "#e6f0ff" : "#f2f2f2")};
    border-radius: ${({ role }) =>
            role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0"};
    padding: 12px 16px;
    max-width: 70%;
    font-size: 14px;
    line-height: 1.6;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    word-break: break-word;
    gap: 16px;
    animation: ${fadeIn} 0.3s ease forwards;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        ${({ role }) => role === "user"
                ? `right: -7px; border-left: 7px solid #e6f0ff;`
                : `left: -7px; border-right: 7px solid #f2f2f2;`}
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
    }

    & table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 10px;
        background: white;
    }

    & th, & td {
        border: 1px solid #dcdcdc;
        padding: 6px 10px;
        text-align: left;
        font-size: 13px;
    }

    & th {
        background-color: #f0f0f0;
        font-weight: 600;
    }

    & strong {
        color: #0a0a0a;
    }

    & p {
        margin: 8px 0;
    }
`;

export const InputArea = styled.div`
    display: flex;
    background-color: rgba(255, 255, 255, 0.83);
    padding: 8px;
    bottom: 10px;
    flex-direction: column;
    width: 80%;
    gap: 8px;

    textarea {
        &::placeholder {
            color: #94a3b8;
            font-style: italic;
        }
    }
`;
