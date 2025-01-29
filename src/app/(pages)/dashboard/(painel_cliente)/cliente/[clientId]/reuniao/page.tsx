'use client';

import ClientMeetings from '@/app/components/cliente/meeting/ClientMeetings';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ClientReuniaoPage = ({ params }: { params: { clientId: string } }) => {
    const { clientId } = params;
    const [clientName, setClientName] = useState<string>('');

    useEffect(() => {
        // Supondo que você tenha uma API para buscar os detalhes do cliente
        const fetchClientDetails = async () => {
            try {
                const response = await axios.get(`/api/v1/clientes/${clientId}/`);
                setClientName(response.data.nome);
            } catch (error) {
                console.error('Erro ao buscar detalhes do cliente:', error);
            }
        };

        fetchClientDetails();
    }, [clientId]);

    return (
            <ClientMeetings clientId={clientId} clientName={clientName} />
    );
};

export default ClientReuniaoPage;
