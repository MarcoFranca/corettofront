'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/axios';
import styles from './LeadDetails.module.css';

interface Lead {
    id: number;
    nome: string;
    contato: string;
    telefone: string;
    email: string;
    endereco: string;
    status: string;
    pipeline_stage: string;
}

const LeadDetails = ({ params }: { params: { leadId: string } }) => {
    const [lead, setLead] = useState<Lead | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await api.get(`/clientes/${params.leadId}/`);
                setLead(response.data);
            } catch (error) {
                console.error('Erro ao buscar os detalhes do lead:', error);
                router.push('/dashboard/lead');
            }
        };

        fetchLead();
    }, [params.leadId, router]);

    if (!lead) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={styles.leadDetails}>
            <h1>{lead.nome}</h1>
            <p>Contato: {lead.contato}</p>
            <p>Telefone: {lead.telefone}</p>
            <p>Email: {lead.email}</p>
            <p>Endereço: {lead.endereco}</p>
            <p>Status: {lead.status}</p>
            <p>Stagio: {lead.pipeline_stage}</p>
            <button onClick={() => router.push('/dashboard/lead')}>Voltar</button>
        </div>
    );
};

export default LeadDetails;
