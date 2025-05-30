"use client";
import React, {useEffect, useRef, useState} from "react";
import { Input, Button, Spin, Progress, Upload, UploadProps, Avatar } from "antd";
import { SendOutlined, PaperClipOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import api from "@/app/api/axios";
import { ChatContainer, InputArea, MessageBubble, StyledDrawer, MessageRow, DrawerFlex, MainChat, Sidebar, ThreadList, ThreadItem } from "@/app/components/openai/CoraDrower.styles";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { TextArea } = Input;

interface Message {
    role: "user" | "assistant";
    content: string;
}

const CoraDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [tokensRestantes, setTokensRestantes] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [contextFromFile, setContextFromFile] = useState<string>("");
    const profile = useSelector((state: RootState) => state.profile.data);
    const totalTokens = (profile?.plano?.tokens_chatgpt || 0) + (profile?.tokens_extras_chatgpt || 0);
    const chatRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [threads, setThreads] = useState<{thread_id: string, last_message: string, created_at: string, preview: string}[]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    // Carrega lista de threads ao abrir drawer
    useEffect(() => {
        if (!open) return;
        api.get("/integrations/chatgpt/threads/").then(res => {
            setThreads(res.data);
        });
    }, [open]);

    // Carrega histórico sempre que selectedThreadId muda
    useEffect(() => {
        if (!open) return;
        if (!selectedThreadId) {
            setMessages([]); // nova conversa
            return;
        }
        setLoading(true);
        api.get(`/integrations/chatgpt/historico/?thread_id=${selectedThreadId}`).then(res => {
            const msgs = res.data.flatMap((msg: any) => [
                {role: "user", content: msg.mensagem},
                {role: "assistant", content: msg.resposta}
            ]);
            setMessages(msgs);
            setLoading(false);
            setTimeout(() => {
                if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "auto" });
            }, 100);
        });
    }, [open, selectedThreadId]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Enviar mensagem
    const sendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);

        let context = "";

        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            try {
                const uploadResp = await api.post("/integrations/chatgpt/upload/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                context = uploadResp?.data?.conteudo_extraido?.slice(0, 3000) || "";
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `📎 Arquivo enviado: **${selectedFile.name}**\n\nA Cora vai usar esse conteúdo para te ajudar melhor.`,
                    },
                ]);
                setSelectedFile(null);
            } catch {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `❌ Falha ao enviar o arquivo: **${selectedFile.name}**`,
                    },
                ]);
                setLoading(false);
                return;
            }
        } else {
            context = contextFromFile;
        }

        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput("");

        try {
            // ENVIA COM O thread_id atual (se existir)
            const response = await api.post("/integrations/chatgpt/", {
                mensagem: input,
                contexto: context,
                thread_id: selectedThreadId // se null, backend cria novo!
            });
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.data.resposta }
            ]);
            setTokensRestantes(response.data.tokens_restantes);

            // Se era uma nova conversa, recebe e armazena o thread_id criado pelo backend!
            if (!selectedThreadId && response.data.thread_id) {
                setSelectedThreadId(response.data.thread_id);
                // Atualiza lista de threads após criar nova
                api.get("/integrations/chatgpt/threads/").then(res => {
                    setThreads(res.data);
                });
            }
        } catch (err: any) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Desculpe, algo deu errado 😢" }]);
        } finally {
            setLoading(false);
        }
    };

    const propsUpload: UploadProps = {
        name: "file",
        beforeUpload: (file) => {
            setSelectedFile(file);
            return false;
        },
        showUploadList: selectedFile
            ? {
                showRemoveIcon: false,
                showDownloadIcon: false,
                showPreviewIcon: false,
            }
            : false,
    };

    return (
        <StyledDrawer title="🤖 Cora - sua assistente" placement="right" width={"80vw"} onClose={onClose} open={open}>
            <DrawerFlex>
                {/* SIDEBAR CONVERSAS */}
                <Sidebar>
                    <Button type="primary" block onClick={() => {
                        setSelectedThreadId(null);
                        setMessages([]);
                    }}>+ Nova conversa</Button>
                    <ThreadList>
                        {threads.map(t => (
                            <ThreadItem
                                key={t.thread_id}
                                selected={t.thread_id === selectedThreadId}
                                onClick={() => setSelectedThreadId(t.thread_id)}
                            >
                                <div style={{ fontSize: 15 }}>
                                    {t.last_message?.slice(0, 32) || "Conversa"}
                                </div>
                                <div style={{ fontSize: 11, color: "#888" }}>
                                    {t.created_at && (new Date(t.created_at)).toLocaleString()}
                                </div>
                            </ThreadItem>
                        ))}
                    </ThreadList>
                </Sidebar>

                {/* CHAT PRINCIPAL */}
                <MainChat>
                    <ChatContainer ref={chatRef} style={{ flex: 1, marginBottom: 0 }}>
                        {messages.map((msg, index) => (
                            <MessageRow key={index} role={msg.role}>
                                {msg.role === "assistant" &&
                                    <Avatar icon={<RobotOutlined/>} style={{backgroundColor: "#dbeafe"}}/>}
                                <MessageBubble role={msg.role}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </MessageBubble>
                                {msg.role === "user" && <Avatar icon={<UserOutlined/>} style={{backgroundColor: "#cbd5e1"}}/>}
                            </MessageRow>
                        ))}
                        {loading && <Spin size="small"/>}
                        <div ref={bottomRef}/>
                    </ChatContainer>

                    {/* CAMPO DE MENSAGEM */}
                    <InputArea >
                        <TextArea
                            rows={2}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onPressEnter={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                        />
                        <Upload {...propsUpload}>
                            <Button icon={<PaperClipOutlined/>} style={{ marginBottom: 10 }}>
                                Anexar arquivo
                            </Button>
                        <Button
                            onClick={sendMessage}
                            disabled={loading || !input.trim() || (tokensRestantes !== null && tokensRestantes <= 0)}
                            icon={<SendOutlined/>}
                        >
                            Enviar
                        </Button>
                        </Upload>
                        {tokensRestantes !== null && totalTokens > 0 && (
                            <Progress
                                percent={((totalTokens - tokensRestantes) / totalTokens) * 100}
                                status={tokensRestantes < 1000 ? "exception" : "active"}
                            />
                        )}
                        {tokensRestantes !== null && (
                            <div style={{marginTop: 10, color: tokensRestantes < 1000 ? "red" : "green"}}>
                                Tokens restantes: {tokensRestantes.toLocaleString()}
                                {tokensRestantes < 1000 && " ⚠️ Está quase acabando!"}
                            </div>
                        )}
                    </InputArea>
                </MainChat>
            </DrawerFlex>
        </StyledDrawer>
    );

};

export default CoraDrawer;
