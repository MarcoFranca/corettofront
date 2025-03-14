"use client";
import React, { useEffect, useState } from "react";
import styles from "./PagamentoSucesso.module.css";
import { useRouter, useSearchParams } from "next/navigation"; // Importação correta
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function PagamentoSucesso() {
    const searchParams = useSearchParams();
    const session_id = searchParams.get("session_id"); // Agora o Next.js pegará corretamente
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Processando...");
    const router = useRouter();

    useEffect(() => {
        console.log("🔍 Session ID Recebido:", session_id);
    }, [session_id]);

    useEffect(() => {
        if (session_id) {
            console.log("Session ID recebido:", session_id);
            setLoading(false);
            setMessage("Pagamento concluído com sucesso! Obrigado.");
        } else {
            console.error("Session ID não recebido.");
            setMessage("Ocorreu um erro: ID de sessão ausente.");
            setLoading(false);
        }
    }, [session_id]);

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.successBox}>
                <AiOutlineCheckCircle className={styles.checkIcon} />
                <h1 className={styles.successMessage}>{message}</h1>
                <p className={styles.thankYou}>Obrigado por sua compra!</p>
                <p className={styles.infoText}>
                    Você pode gerenciar sua assinatura ou explorar mais serviços clicando abaixo.
                </p>
                <div className={styles.buttonContainer}>
                    <button className={styles.manageButton} onClick={() => router.push("/minha-assinatura")}>
                        Gerenciar Assinatura
                    </button>
                    <button className={styles.exploreButton} onClick={() => router.push("/dashboard/config")}>
                        Ir Para o Programa
                    </button>
                </div>
            </div>
        </div>
    );
}
