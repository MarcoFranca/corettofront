import React, { useEffect, useRef, useState } from "react";
import { Drawer, Button, Input, Spin, Alert, Avatar } from "antd";
import api from "@/app/api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThunderboltOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import {
    chatStyle,
    sidebarStyle
} from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/ClienteInsightDrower.styles";
import {MessageBubble, MessageRow} from "@/app/components/openai/CoraDrower.styles";
import {Cliente} from "@/types/interfaces";

// Styles sugeridos (ou use styled-components igual ao chat)



interface Thread {
    thread_id: string;
    last_message: string;
    created_at: string;
    preview: string;
}
interface HistoricoMsg {
    mensagem: string;
    resposta: string;
}
interface ClienteInsightDrawerProps {
    open: boolean;
    onClose: () => void;
    cliente: Cliente | null;
    // Se quiser filtrar threads só desse cliente, pode passar o clienteId
    clienteId?: string;
}
interface Message {
    role: "user" | "assistant";
    content: string;
}

const ClienteInsightDrawer: React.FC<ClienteInsightDrawerProps> = ({
                                                                       open, onClose, cliente
                                                                   }) => {

    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [historico, setHistorico] = useState<HistoricoMsg[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [loadingThreads, setLoadingThreads] = useState(false);
    const [loadingHistorico, setLoadingHistorico] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // 1. Carrega threads (apenas de insight, se quiser filtrar pelo modelo_usado!)
    useEffect(() => {
        if (!open || !cliente || !cliente.id) return;
        setLoadingThreads(true);
        api.get(`/integrations/chatgpt/threads/?modelo_usado=Cora Insight&cliente_id=${cliente.id}`)
            .then(res => setThreads(res.data))
            .finally(() => setLoadingThreads(false));
    }, [open, cliente]);


    // 2. Carrega histórico ao selecionar uma thread
    useEffect(() => {
        if (!selectedThreadId || !cliente?.id) {
            setMessages([]);
            return;
        }
        setLoadingHistorico(true);
        api.get(`/integrations/chatgpt/historico/?thread_id=${selectedThreadId}&modelo_usado=Cora Insight&cliente_id=${cliente.id}`)
            .then(res => {
                // Para cada registro, cria dois balões: user e assistant
                const msgs: Message[] = [];
                res.data.forEach((msg: any) => {
                    if (msg.mensagem) {
                        msgs.push({ role: "user", content: msg.mensagem });
                    }
                    if (msg.resposta) {
                        msgs.push({ role: "assistant", content: msg.resposta });
                    }
                });
                setMessages(msgs);
            })
            .finally(() => setLoadingHistorico(false));
    }, [selectedThreadId, cliente?.id]);




    // 3. Rola para baixo ao adicionar msg
    useEffect(() => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 120);
    }, [historico, loading]);

    // 4. Envio de nova pergunta/insight
    async function handlePedirInsight() {
        if ((historico.length === 0 && !selectedThreadId)) {
            // Primeira mensagem: envia padrão
            setLoading(true);
            setErro(null);
            try {
                const result = await api.post("/integrations/chatgpt/insight/", {
                    cliente_id: cliente?.id,
                    mensagem: descricao,
                    thread_id: selectedThreadId
                });
                setDescricao("");
                if (result.data.thread_id) {
                    setSelectedThreadId(result.data.thread_id);
                }
                // Busca histórico da thread assim que responder
                const thread = result.data.thread_id || selectedThreadId;
                if (thread) {
                    const historicoResult = await api.get(
                        `/integrations/chatgpt/historico/?thread_id=${thread}&modelo_usado=Cora Insight&cliente_id=${cliente?.id}`
                    );
                    setHistorico(historicoResult.data);
                }
            } catch (err) {
                setErro("Erro ao pedir insight, tente novamente.");
            }
            setLoading(false);
        }

        // Demais mensagens
        if (!descricao.trim()) return;
        setLoading(true);
        setErro(null);
        try {
            const result = await api.post("/integrations/chatgpt/insight/", {
                cliente_id: cliente?.id,
                mensagem: descricao,
                thread_id: selectedThreadId
            });
            setDescricao("");
            const thread = result.data.thread_id || selectedThreadId;
            if (thread) {
                const historicoResult = await api.get(`/integrations/chatgpt/historico/?thread_id=${thread}&modelo_usado=Cora Insight&cliente_id=${cliente?.id}`);
                setHistorico(historicoResult.data);
            }
        } catch (err) {
            setErro("Erro ao pedir insight, tente novamente.");
        }
        setLoading(false);
    }

    return (
        <Drawer
            title={(
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThunderboltOutlined style={{ color: "#FFB800", fontSize: 22 }} />
          Insight de Venda — {cliente?.nome}
        </span>
            )}
            width={"82vw"}
            open={open}
            onClose={onClose}
            destroyOnClose
            bodyStyle={{ display: "flex", padding: 0, minHeight: 600 }}
        >
            {/* Sidebar */}
            <div style={sidebarStyle}>
                <Button type="primary" block onClick={() => { setSelectedThreadId(null); setHistorico([]); }}>
                    + Novo Insight
                </Button>
                <div style={{ marginTop: 14 }}>
                    {loadingThreads ? (
                        <div style={{ textAlign: "center", marginTop: 24 }}><Spin /></div>
                    ) : (
                        threads.map(t => (
                        <div
                            key={t.thread_id}
                            onClick={() => setSelectedThreadId(t.thread_id)}
                            style={{
                                cursor: "pointer",
                                background: t.thread_id === selectedThreadId ? "#e0e7ef" : "transparent",
                                padding: "8px 10px", borderRadius: 6, marginBottom: 2,
                                fontWeight: t.thread_id === selectedThreadId ? 600 : 400,
                            }}
                        >
                            <div style={{ fontSize: 14 }}>{t.last_message?.slice(0, 36) || "Insight"}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>{t.created_at && (new Date(t.created_at)).toLocaleString()}</div>
                        </div>
                    ))
                    )}
                </div>
            </div>
            {/* Main chat */}
            <div style={chatStyle}>
                <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
                    {loadingHistorico ? (
                        <div style={{ textAlign: "center", marginTop: 48 }}><Spin /></div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#777", marginTop: 64 }}>
                            Nenhum insight ainda.<br />Peça um insight para começar!
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <MessageRow key={i} role={msg.role}>
                                {msg.role === "assistant" && (
                                    <Avatar icon={<RobotOutlined />} style={{ background: "#dbeafe" }} />
                                )}
                                <MessageBubble role={msg.role} style={{ marginBottom: "16px" }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </MessageBubble>
                                {msg.role === "user" && (
                                    <Avatar icon={<UserOutlined />} style={{ background: "#cbd5e1" }} />
                                )}
                            </MessageRow>
                        ))
                    )}

                    <div ref={chatEndRef} />
                </div>
                {/* Campo para nova pergunta */}
                <div style={{ borderTop: "1px solid #eee", padding: 24 }}>
                    {erro && <Alert type="error" message={erro} showIcon style={{ marginBottom: 10 }} />}
                    <Input.TextArea
                        rows={2}
                        placeholder="Digite sua pergunta, dúvida ou peça um novo insight..."
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        onPressEnter={e => { e.preventDefault(); handlePedirInsight(); }}
                        disabled={loading || loadingThreads || loadingHistorico || (messages.length === 0 && !selectedThreadId)}
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="primary"
                            onClick={handlePedirInsight}
                            loading={loading}
                            disabled={messages.length > 0 && !descricao.trim()}
                            block>
                        {selectedThreadId ? "Perguntar para a Cora" : "Pedir Insight da Cora"}
                    </Button>
                </div>
            </div>

        </Drawer>
    );
};

export default ClienteInsightDrawer;
