
// styled-components
import { Drawer as AntDrawer } from 'antd';
import styled from "styled-components";

export const StyledDrawer = styled(AntDrawer)`
    .ant-drawer-body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px;
        height: 100%;
    }
`;

export const ChatContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 16px;
`;

export const MessageBubble = styled.div<{ role: 'user' | 'assistant' }>`
    background-color: ${({ role }) => (role === 'user' ? '#d1e7ff' : '#e8e8e8')};
    padding: 10px 14px;
    margin: 8px 0;
    border-radius: 10px;
    align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
    max-width: 80%;
`;

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;