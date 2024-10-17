'use client'
import api from '@/app/api/axios';  // Supondo que api é o axios configurado para a sua API
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTokenFromLocalStorage, setUserFromLocalStorage } from '@/store/slices/authSlice';

export default function PlansPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    const { token } = useSelector((state) => state.auth);
    const isAuthenticated = !!token?.access;

    useEffect(() => {
        // Carregar o token e o usuário do localStorage
        dispatch(setTokenFromLocalStorage());
        dispatch(setUserFromLocalStorage());
    }, [dispatch]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/pagamentos/planos/');
                setPlans(response.data);
                setLoading(false);
            } catch (error) {
                setError('Erro ao carregar planos. Tente novamente mais tarde.');
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSelectPlan = async (price_id, plano_id) => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        try {
            const response = await api.post('/pagamentos/create-checkout-session/', {
                price_id,
                plano_id,
            });

            if (response.data && response.data.checkout_url) {
                // Redirecionar para o URL gerado pelo Stripe
                router.push(response.data.checkout_url);
            } else {
                setError('Erro ao iniciar o checkout. Tente novamente mais tarde.');
            }
        } catch (error) {
            setError('Erro ao processar o pagamento. Tente novamente mais tarde.');
        }
    };

    return (
        <div>
            <h1>Escolha seu Plano</h1>
            {loading ? (
                <p>Carregando planos...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    {plans.map((plan) => (
                        <div key={plan.id}>
                            <h2>{plan.nome}</h2>
                            <p>{plan.descricao}</p>
                            <p>Preço: R$ {plan.preco}</p>
                            <button
                                onClick={() => handleSelectPlan(plan.stripe_price_id, plan.id)}
                            >
                                Escolher Plano
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
