// components/Cora/CoraDrawer.tsx
"use client";
import React, {useEffect, useRef, useState} from "react";
import { Input, Button, Spin, Progress, Upload, UploadProps, Avatar } from "antd";
import { SendOutlined, PaperClipOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import api from "@/app/api/axios";
import { ChatContainer, InputArea, MessageBubble, StyledDrawer, MessageRow } from "@/app/components/openai/CoraDrower.styles";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { TextArea } = Input;

interface Message {
    role: "user" | "assistant";
    content: string;
}

const calcularDiasRestantes = (dataFinal: string | undefined | null) => {
    if (!dataFinal) return 0;
    const hoje = new Date();
    const fim = new Date(dataFinal);
    const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
};

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

    useEffect(() => {
        const carregarHistorico = async () => {
            try {
                const response = await api.get("/integrations/chatgpt/historico/");
                setMessages(
                    response.data.flatMap((msg: any) => [
                        { role: "user", content: msg.mensagem },
                        { role: "assistant", content: msg.resposta },
                    ])
                );
                setTimeout(() => {
                    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "auto" });
                }, 100); // pequeno delay para garantir que renderizou

            } catch (err) {
                console.error("Erro ao carregar histórico da Cora", err);
            }
        };

        if (open) carregarHistorico();
    }, [open]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, loading]);


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

        const newMessages: Message[] = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await api.post("/integrations/chatgpt/", {
                mensagem: input,
                contexto: context,
            });

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.data.resposta }
            ]);

            setTokensRestantes(response.data.tokens_restantes);
        } catch (err: any) {
            if (err?.response?.status === 403 && err?.response?.data?.error?.includes("tokens")) {
                const diasRestantes = calcularDiasRestantes(profile?.current_period_end);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `😱 **Seus Cora Coins acabaram!**\n\nFaltam **${diasRestantes} dias** para renovar seu plano, mas você pode [comprar tokens extras](/dashboard/tokens) para continuar usando a Cora!`,
                    },
                ]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "Desculpe, algo deu errado 😢" }]);
            }
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
            {tokensRestantes !== null && totalTokens > 0 && (
                <Progress
                    percent={((totalTokens - tokensRestantes) / totalTokens) * 100}
                    status={tokensRestantes < 1000 ? "exception" : "active"}
                    showInfo={false}
                />
            )}
            <ChatContainer ref={chatRef}>
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
            <InputArea>
            <Upload {...propsUpload}>
                    <Button icon={<PaperClipOutlined />} style={{ marginBottom: 10 }}>
                        Anexar arquivo
                    </Button>
                </Upload>
                <TextArea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                />
                {tokensRestantes !== null && (
                    <div style={{ marginTop: 10, color: tokensRestantes < 1000 ? "red" : "green" }}>
                        Tokens restantes: {tokensRestantes.toLocaleString()}
                        {tokensRestantes < 1000 && " ⚠️ Está quase acabando!"}
                    </div>
                )}
                <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim() || (tokensRestantes !== null && tokensRestantes <= 0)}
                    icon={<SendOutlined />}
                >
                    Enviar
                </Button>
            </InputArea>
        </StyledDrawer>
    );
};

export default CoraDrawer;