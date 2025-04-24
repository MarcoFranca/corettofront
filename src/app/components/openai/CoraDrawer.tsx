// components/Cora/CoraDrawer.tsx
'use client';
import React, { useState } from 'react';
import {  Input, Button, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import api from '@/app/api/axios';
import {ChatContainer, InputArea, MessageBubble, StyledDrawer} from "@/app/components/openai/CoraDrower.styles";

const { TextArea } = Input;

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const CoraDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/integrations/chatgpt/', {
                mensagem: input
            });
            setMessages([...newMessages, { role: 'assistant', content: response.data.resposta }]);
        } catch (err) {
            setMessages([...newMessages, { role: 'assistant', content: 'Desculpe, algo deu errado 😢' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledDrawer title="🤖 Cora - sua assistente" placement="right" width={420} onClose={onClose} open={open}>
            <ChatContainer>
                {messages.map((msg, index) => (
                    <MessageBubble key={index} role={msg.role}>
                        {msg.content}
                    </MessageBubble>
                ))}
                {loading && <Spin size="small" />}
            </ChatContainer>
            <InputArea>
                <TextArea rows={2} value={input} onChange={(e) => setInput(e.target.value)} onPressEnter={(e) => {
                    e.preventDefault();
                    sendMessage();
                }} />
                <Button icon={<SendOutlined />} type="primary" onClick={sendMessage}>
                    Enviar
                </Button>
            </InputArea>
        </StyledDrawer>
    );
};

export default CoraDrawer;
