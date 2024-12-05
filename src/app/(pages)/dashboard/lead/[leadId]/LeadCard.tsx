import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { updateLead } from '@/store/slices/leadsSlice';
import { Lead, Column, StatusReuniao } from '@/types/interfaces';
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
    'marcar_reuniao': 'blue',
};

const statusLabels: Record<StatusReuniao, string> = {
    'reuniao_marcada': 'Reunião Marcada',
    'retornar': 'Retornar',
    'nao_tem_interesse': 'Não Tem Interesse',
    'nao_atendeu': 'Não Atendeu',
    'marcar_reuniao': 'Marcar Reunião',
};

const pipelineColors: Record<string, string> = {
    'leads de entrada': '#2196F3',
    'negociando': '#FFC107',
    'finalização': '#4CAF50',
    'pouco interesse': '#F44336',
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, columns }) => {
    const dispatch = useAppDispatch();
    const [statusReuniao, setStatusReuniao] = useState<StatusReuniao>(lead.status_reuniao);
    const [pipelineStage, setPipelineStage] = useState<string>(lead.pipeline_stage || '');
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [isEditingPipeline, setIsEditingPipeline] = useState(false);

    const handleStatusReuniaoChange = async (newStatus: StatusReuniao) => {
        setStatusReuniao(newStatus);
        await dispatch(updateLead({ id: lead.id, updatedLead: { status_reuniao: newStatus } }));
        setIsEditingStatus(false);
    };

    const handlePipelineChange = async (newPipeline: string) => {
        setPipelineStage(newPipeline);
        await dispatch(updateLead({ id: lead.id, updatedLead: { pipeline_stage: newPipeline } }));
        setIsEditingPipeline(false);
    };

    return (
        <div className={styles.mobileLead}>
            <div className={styles.mobileLeadContain}>
                <h3>{lead.nome}</h3>
                <p>{lead.email}</p>
                <p>{lead.telefone}</p>

                {/* Status Reunião */}
                <h2
                    style={{ color: statusColors[statusReuniao], cursor: 'pointer' }}
                    onClick={() => setIsEditingStatus(true)} // Mostra o select ao clicar
                >
                    {isEditingStatus ? (
                        <select
                            className={styles.statusReuniaoDropdown}
                            value={statusReuniao}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusReuniaoChange(e.target.value as StatusReuniao)}
                            onBlur={() => setIsEditingStatus(false)} // Oculta ao perder o foco
                        >
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        statusLabels[statusReuniao]
                    )}
                </h2>

                {/* Pipeline */}
                <h2
                    style={{ color: pipelineColors[pipelineStage.toLowerCase()], cursor: 'pointer' }}
                    onClick={() => setIsEditingPipeline(true)} // Mostra o select ao clicar
                >
                    {isEditingPipeline ? (
                        <select
                            className={styles.pipelineDropdown}
                            value={pipelineStage}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handlePipelineChange(e.target.value)}
                            onBlur={() => setIsEditingPipeline(false)} // Oculta ao perder o foco
                        >
                            {Object.keys(pipelineColors).map((pipeline) => (
                                <option key={pipeline} value={pipeline}>
                                    {pipeline.charAt(0).toUpperCase() + pipeline.slice(1)}
                                </option>
                            ))}
                        </select>
                    ) : (
                        pipelineStage.charAt(0).toUpperCase() + pipelineStage.slice(1) // Capitaliza
                    )}
                </h2>
            </div>
        </div>
    );
};

export default LeadCard;
