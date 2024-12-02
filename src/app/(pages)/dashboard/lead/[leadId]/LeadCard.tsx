import React from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { updateLeadStatus } from '@/store/slices/leadsSlice';
import { Lead, Column } from '@/types/interfaces';
import styles from './LeadCard.module.css';

interface LeadCardProps {
    lead: Lead;
    columns: Column[];
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, columns }) => {
    const dispatch = useAppDispatch();

    const handleStatusChange = (newId: string) => {
        const selectedColumn = columns.find((column) => column.id === newId);
        if (!selectedColumn) return;

        const statusToSend = selectedColumn.title.toLowerCase(); // Converte para lowercase
        dispatch(updateLeadStatus({ id: lead.id, status: statusToSend }));
    };

    return (
        <div className={styles.mobileLead}>
            <div>
                <h3>{lead.nome}</h3>
                <p>{lead.email}</p>
                <p>{lead.telefone}</p>
            </div>
            <select
                className={styles.statusDropdown}
                value={lead.pipeline_stage.toLowerCase()} // Atualizado para refletir o estado correto
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
