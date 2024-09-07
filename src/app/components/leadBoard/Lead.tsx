import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import { AppDispatch } from '@/store';
import { deleteLead } from '@/store/slices/leadsSlice';
import styles from './LeadBoard.module.css';
import Image from 'next/image';
import UserImage from '../../../../public/assets/common/user.png';
import DeleteImage from '../../../../public/assets/common/delete.svg';
import AgendaImage from '../../../../public/assets/pages/agenda/agenda.svg';
import EditImage from '../../../../public/assets/common/edit.svg';
import { LeadProps, Lead, StatusReuniao } from "@/types/interfaces";
import ScheduleMeetingForm from '@/app/components/Modal/meeting/ScheduleMeetingForm';
import EditLeadForm from '@/app/components/leads/EditLeadForm';
import ReactDOM from 'react-dom';

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

const LeadComponent: React.FC<LeadProps> = ({ lead, index, handleLeadClick, handleLeadDragStart, isLastColumn, tooltipContainerRef }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentLead, setCurrentLead] = useState(lead);

    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setCurrentLead(lead);
    }, [lead]);

    const handleMouseEnter = (e: React.MouseEvent) => {
        const { top, left, height } = e.currentTarget.getBoundingClientRect();
        tooltipTimeoutRef.current = setTimeout(() => {
            const tooltipTop = top + height / 2 + window.scrollY;
            const tooltipLeft = isLastColumn ? left - 260 : left + 380;
            setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
            setShowTooltip(true);
        }, 1000);
    };

    const handleMouseLeave = () => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(false);
    };

    const handleDeleteConfirm = () => {
        setShowConfirmModal(false);
        dispatch(deleteLead(lead.id));
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirmModal(true);
    };

    const handleDeleteCancel = () => {
        setShowConfirmModal(false);
    };

    const handleScheduleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowScheduleForm(true);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditForm(true);
    };

    const handleScheduleFormClose = () => {
        setShowScheduleForm(false);
    };

    const handleEditFormClose = () => {
        setShowEditForm(false);
    };

    const handleUpdateLead = (updatedLead: Lead) => {
        setCurrentLead(updatedLead);
    };

    const renderTooltip = () => {
        return (
            <div
                className={isLastColumn ? styles.tooltipLeft : styles.tooltip}
                key={currentLead.id}
                style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
            >
                <p><strong>Nome:</strong> {currentLead.nome}</p>
                <p><strong>Email:</strong> {currentLead.email}</p>
                <p><strong>Telefone:</strong> {currentLead.telefone}</p>
                <p><strong>Status:</strong> {currentLead.pipeline_stage}</p>
                <p><strong>Status Reunião:</strong> {statusLabels[currentLead.status_reuniao]}</p>
                <p><strong>Data de Criação:</strong> {new Date(currentLead.created_at).toLocaleString()}</p>
                <p><strong>Última Atualização:</strong> {new Date(currentLead.updated_at).toLocaleString()}</p>
            </div>
        );
    };

    return (
        <>
            <Draggable draggableId={currentLead.id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.lead}
                        onClick={() => handleLeadClick(currentLead.id)}
                        onDragStart={handleLeadDragStart}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className={styles.leadCell}>
                            <div className={styles.leadCard}>
                                <div className={styles.leadContent}>
                                    <Image className={styles.userImage} src={UserImage} alt={'user'} priority />
                                    <div className={styles.leadContentText}>
                                        <p>{currentLead.nome}</p>
                                        <h2 style={{ color: statusColors[currentLead.status_reuniao] }}>
                                            {statusLabels[currentLead.status_reuniao]}
                                        </h2>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <Image src={AgendaImage} alt={'Schedule'} className={styles.actionIcon} onClick={handleScheduleClick} priority />
                                    <Image src={EditImage} alt={'Edit'} className={styles.actionIcon} onClick={handleEditClick} priority />
                                    <Image src={DeleteImage} alt={'Delete'} className={styles.actionIcon} onClick={handleDeleteClick} priority />
                                </div>
                            </div>
                        </div>
                        {showTooltip && tooltipContainerRef.current && ReactDOM.createPortal(renderTooltip(), tooltipContainerRef.current)}
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
            {showScheduleForm && (
                <ScheduleMeetingForm entityId={currentLead.id} entityName={currentLead.nome} entityType="lead" onClose={handleScheduleFormClose} />
            )}
            {showEditForm && (
                <EditLeadForm lead={currentLead} onClose={handleEditFormClose} onUpdate={handleUpdateLead} />
            )}
        </>
    );
};

export default LeadComponent;
