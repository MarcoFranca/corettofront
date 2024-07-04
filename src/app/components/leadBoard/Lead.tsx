import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import { AppDispatch } from '@/store'; // Certifique-se de que você está importando o tipo correto do seu store
import { deleteLead } from '@/store/slices/leadsSlice';
import styles from './LeadBoard.module.css';
import Image from 'next/image';
import UserImage from '@/../public/assets/user.png';
import DeleteImage from '@/../public/assets/delete.svg';

interface LeadProps {
    lead: {
        id: string;
        status: string;
        name: string;
        pipeline_stage?: string;
        email?: string;
        telefone?: string;
    };
    index: number;
    handleLeadClick: (leadId: string) => void;
    handleLeadDragStart: () => void;
    isLastColumn?: boolean; // Nova prop para identificar a última coluna
}

const Lead: React.FC<LeadProps> = ({ lead, index, handleLeadClick, handleLeadDragStart, isLastColumn }) => {
    const dispatch = useDispatch<AppDispatch>(); // Use o tipo AppDispatch
    const [showTooltip, setShowTooltip] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(true);
        }, 1000); // 1 segundo
    };

    const handleMouseLeave = () => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(false);
    };

    const handleDeleteConfirm = () => {
        setShowConfirmModal(false);
        dispatch(deleteLead(lead.id)); // Chama a ação de deleção
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede a propagação do clique
        setShowConfirmModal(true);
    };

    const handleDeleteCancel = () => {
        setShowConfirmModal(false);
    };

    return (
        <>
            <Draggable draggableId={lead.id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.lead}
                        onClick={() => handleLeadClick(lead.id)}
                        onDragStart={handleLeadDragStart}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Image className={styles.userImage} src={UserImage} alt={'user'} priority />
                        <div className={styles.leadList}>
                            <p>{lead.name}</p>
                            <h2>{lead.status}</h2>
                        </div>
                        <div className={styles.actions}>
                            <Image src={DeleteImage} alt={'Delete'} className={styles.actionIcon} onClick={handleDeleteClick} priority />
                        </div>
                        {showTooltip && (
                            <div className={isLastColumn ? styles.tooltipLeft : styles.tooltip}>
                                <p><strong>Nome:</strong> {lead.name}</p>
                                <p><strong>Email:</strong> {lead.email}</p>
                                <p><strong>Telefone:</strong> {lead.telefone}</p>
                                <p><strong>Status:</strong> {lead.pipeline_stage}</p>
                            </div>
                        )}
                    </div>
                )}
            </Draggable>
            {showConfirmModal && (
                <div className={styles.confirmModal}>
                    <div className={styles.confirmModalContent}>
                        <p>Tem certeza que deseja deletar este lead?</p>
                        <button onClick={handleDeleteConfirm}>Sim</button>
                        <button onClick={handleDeleteCancel}>Não</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Lead;
