import React from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { updateLeadStatus } from '@/store/slices/leadsSlice';
import {Lead, Column, StatusReuniao} from '@/types/interfaces';
import styles from './LeadCard.module.css';

interface LeadCardProps {
    lead: Lead;
    columns: Column[];
}

const statusColors: Record<StatusReuniao, string> = {
    'reuniao_marcada': 'green',
    'retornar': '#f1cb0e',
    'nao_tem_interesse': 'red',
    'nao_atendeu': 'orange',
    'marcar_reuniao': 'blue'
};

const statusLabels: Record<StatusReuniao, string> = {
    'reuniao_marcada': 'Reunião Marcada',
    'retornar': 'Retornar',
    'nao_tem_interesse': 'Não Tem Interesse',
    'nao_atendeu': 'Não Atendeu',
    'marcar_reuniao': 'Marcar Reunião'
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, columns }) => {
    const dispatch = useAppDispatch();

    // Função para encontrar a coluna correspondente ao estado atual do lead
    const getCurrentColumnId = () => {
        const currentColumn = columns.find(
            (column) => column.title.toLowerCase() === lead.pipeline_stage?.toLowerCase()
        );
        return currentColumn?.id || ''; // Retorna o `id` da coluna ou uma string vazia
    };

    const handleStatusChange = (newId: string) => {
        const selectedColumn = columns.find((column) => column.id === newId);
        if (!selectedColumn) return;

        const statusToSend = selectedColumn.title.toLowerCase(); // Converte para lowercase
        dispatch(updateLeadStatus({ id: lead.id, status: statusToSend }));
    };

    return (
        <div className={styles.mobileLead}>
            <div className={styles.mobileLeadContain}>
                <h3>{lead.nome}</h3>
                <p>{lead.email}</p>
                <p>{lead.telefone}</p>
                <h2 style={{color: statusColors[lead.status_reuniao]}}>
                    {statusLabels[lead.status_reuniao]}
                </h2>
            </div>
            <select
                className={styles.statusDropdown}
                value={getCurrentColumnId()} // Alinha o `value` do `select` com o `id` da coluna atual
                onChange={(e) => handleStatusChange(e.target.value)}
            >
                {columns.map((column) => (
                    <option key={column.id} value={column.id}>
                        {column.title} {/* Exibe o título correto */}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LeadCard;
