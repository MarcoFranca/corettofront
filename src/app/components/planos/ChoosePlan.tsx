'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/axios';

export default function ChoosePlan() {
    const [plans, setPlans] = useState([]);
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/planos/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setPlans(response.data);
            } catch (error) {
                console.error('Erro ao buscar os planos:', error);
                setMessage('Erro ao buscar os planos. Tente novamente mais tarde.');
            }
        };

        fetchPlans();
    }, []);

    const handleCheckout = async (priceId: string) => {
        try {
            const response = await api.post(
                '/pagamentos/create-checkout-session/',
                { price_id: priceId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );

            const { checkout_url } = response.data;
            window.location.href = checkout_url; // Redireciona para o Stripe
        } catch (error) {
            console.error('Erro ao criar sessão de checkout:', error);
            setMessage('Erro ao iniciar o processo de pagamento.');
        }
    };

    return (
        <div>
            <h2>Escolha seu Plano</h2>
            {plans.map((plan) => (
                <div key={plan.id}>
                    <h3>{plan.nome}</h3>
                    <p>{plan.descricao}</p>
                    <p>Preço: {plan.preco}</p>
                    <button onClick={() => handleCheckout(plan.stripe_price_id)}>
                        Selecionar
                    </button>
                </div>
            ))}
            {message && <p>{message}</p>}
        </div>
    );
}
