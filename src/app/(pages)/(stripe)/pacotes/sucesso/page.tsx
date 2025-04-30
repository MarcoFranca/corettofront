"use client";

import React, { useEffect, useState } from "react";
import styles from "./PacoteSucesso.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function PacoteSucesso() {
    const searchParams = useSearchParams();
    const session_id = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Processando...");
    const router = useRouter();

    useEffect(() => {
        if (session_id) {
            console.log("Session ID recebido:", session_id);
            setLoading(false);
            setMessage("Tokens adicionados com sucesso!");
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
                <p className={styles.thankYou}>Obrigado pela sua compra!</p>
                <p className={styles.infoText}>
                    Seus tokens já estão disponíveis para uso imediato na assistente Cora.
                </p>
                <div className={styles.buttonContainer}>
                    <button className={styles.exploreButton} onClick={() => router.push("/dashboard")}>
                        Voltar para o Sistema
                    </button>
                    <button className={styles.manageButton} onClick={() => router.push("/pacotes")}>
                        Comprar Mais Tokens
                    </button>
                </div>
            </div>
        </div>
    );
}
