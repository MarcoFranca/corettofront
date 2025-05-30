// utils/chatHelpers.ts
export interface ChatThread {
    thread_id: string;
    created_at: string;
    last_message?: string;
    // ... qualquer outra info relevante
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    created_at?: string;
}
