"use client";
import React, { useEffect, useState } from 'react';
import styles from './PagamentoSucesso.module.css'; // Criar um arquivo CSS para estilos customizados
import { useRouter } from 'next/navigation';
import { AiOutlineCheckCircle } from "react-icons/ai"; // Ícone de sucesso

interface PagamentoSucessoProps {
    searchParams: {
        session_id?: string;
    };
}

export default function PagamentoSucesso({ searchParams }: PagamentoSucessoProps) {
    const session_id = searchParams.session_id;
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Processando...');
    const router = useRouter();

    useEffect(() => {
        if (session_id) {
            console.log('Session ID recebido:', session_id); // Adicione um log
            try {
                // Simule validação com API ou apenas atualize o estado
                setLoading(false);
                setMessage('Pagamento concluído com sucesso! Obrigado.');
            } catch (error) {
                console.error('Erro ao processar o pagamento:', error);
                setMessage('Ocorreu um erro ao processar seu pagamento.');
                setLoading(false);
            }
        } else {
            console.error('Session ID não recebido.');
            setMessage('Ocorreu um erro: ID de sessão ausente.');
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
                <p className={styles.infoText}>Você pode gerenciar sua assinatura ou explorar mais serviços clicando abaixo.</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.manageButton} onClick={() => router.push('/minha-assinatura')}>Gerenciar Assinatura</button>
                    <button className={styles.exploreButton} onClick={() => router.push('/dashboard/config')}>Ir Para o Programa</button>
                </div>
            </div>
        </div>
    );
}
