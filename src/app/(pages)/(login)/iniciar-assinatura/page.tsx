'use client'
import { useEffect } from 'react';
import api from '@/app/api/axios';
import { useRouter } from 'next/navigation';

export default function IniciarAssinatura() {
    const router = useRouter();

    useEffect(() => {
        const iniciarCheckout = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const price_id = process.env.NEXT_PUBLIC_PRICE_ID || '';
                const plano_id = process.env.NEXT_PUBLIC_PLANO_ID || '';

                const response = await api.post(
                    '/pagamentos/create-checkout-session/',
                    { price_id, plano_id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.checkout_url) {
                    router.push(response.data.checkout_url);
                } else {
                    router.push('/erro-checkout');
                }
            } catch (error) {
                console.error('Erro no checkout:', error);
                router.push('/erro-checkout');
            }
        };

        iniciarCheckout();
    }, []);

    return <div>Redirecionando para o checkout seguro...</div>;
}
