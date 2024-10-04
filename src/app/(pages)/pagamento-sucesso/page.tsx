"use client"
import React, { useEffect, useState } from 'react';
import SimpleNavBar from "@/app/components/common/Header/SimpleNavBar";

interface PagamentoSucessoProps {
    searchParams: {
        session_id?: string;
    };
}

export default function PagamentoSucesso({ searchParams }: PagamentoSucessoProps) {
    const session_id = searchParams.session_id;
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Processando...');

    useEffect(() => {
        if (session_id) {
            // Chamar a API para validar ou mostrar dados do pagamento (opcional)
            setLoading(false);
            setMessage('Pagamento concluído com sucesso! Obrigado.');
        }
    }, [session_id]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <SimpleNavBar />
            <h1>{message}</h1>
            <p>Obrigado por sua compra!</p>
            {/* Aqui você pode adicionar mais informações ou até mesmo um botão para continuar */}
        </div>
    );
}
