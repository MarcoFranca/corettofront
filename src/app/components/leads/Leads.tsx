import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchLeads, createLead, updateLead, deleteLead } from '@/store/slices/leadsSlice';
import styles from './Leads.module.css';

interface Lead {
    id?: number;
    nome: string;
    contato: string;
    telefone: string;
    email: string;
    endereco: string;
    status: string;
}

const Leads = () => {
    const dispatch = useAppDispatch();
    const leads = useAppSelector((state) => state.leads.leads);
    const leadStatus = useAppSelector((state) => state.leads.status);
    const error = useAppSelector((state) => state.leads.error);

    useEffect(() => {
        if (leadStatus === 'idle') {
            dispatch(fetchLeads());
        }
    }, [leadStatus, dispatch]);

    const handleCreateLead = async () => {
        const newLead: Lead = {
            nome: 'Novo Lead',
            contato: 'Contato Lead',
            telefone: '123456789',
            email: 'novo.lead@example.com',
            endereco: 'Endereço Lead',
            status: 'lead',
        };
        await dispatch(createLead(newLead));
    };

    const handleUpdateLead = async (id: number) => {
        const updatedLead: Lead = {
            nome: 'Lead Atualizado',
            contato: 'Contato Atualizado',
            telefone: '987654321',
            email: 'lead.atualizado@example.com',
            endereco: 'Endereço Atualizado',
            status: 'lead',
        };
        await dispatch(updateLead({ id, updatedLead }));
    };

    const handleDeleteLead = async (id: number) => {
        await dispatch(deleteLead(id));
    };

    if (leadStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (leadStatus === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.leadsContainer}>
            <button onClick={handleCreateLead}>Criar Lead</button>
            {leads.map((lead: Lead) => (
                <div key={lead.id} className={styles.leadCard}>
                    <h3>{lead.nome}</h3>
                    <p>{lead.contato}</p>
                    <p>{lead.telefone}</p>
                    <p>{lead.email}</p>
                    <p>{lead.endereco}</p>
                    <button onClick={() => handleUpdateLead(lead.id!)}>Atualizar</button>
                    <button onClick={() => handleDeleteLead(lead.id!)}>Deletar</button>
                </div>
            ))}
        </div>
    );
};

export default Leads;
