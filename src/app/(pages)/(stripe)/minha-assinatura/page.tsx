"use client";
import React, { useState } from 'react';
import api from '@/app/api/axios';  // Supondo que api é o axios configurado para a sua API
import SimpleNavBar from '@/app/components/common/Header/SimpleNavBar';

const MinhaAssinatura = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOpenPortal = async () => {
        setLoading(true);
        try {
            const response = await api.post('pagamentos/customer-portal/');
            const { url } = response.data;  // Use "url" ao invés de "portal_url"
            if (url) {
                window.location.href = url;  // Redireciona o usuário para o portal do cliente
            } else {
                setError('Erro ao redirecionar para o portal de pagamentos.');
            }
        } catch (err) {
            setError('Erro ao abrir o portal do cliente.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <SimpleNavBar />
            <h1>Minha Assinatura</h1>
            {error && <p>{error}</p>}
            <button onClick={handleOpenPortal} disabled={loading}>
                {loading ? 'Abrindo portal...' : 'Ver Pagamentos e Recibos'}
            </button>
        </div>
    );
};

export default MinhaAssinatura;
