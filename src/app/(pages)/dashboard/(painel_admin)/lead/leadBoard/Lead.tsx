'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import { AppDispatch } from '@/store';
import { deleteLead } from '@/store/slices/leadsSlice';
import styles from './LeadBoard.module.css';
import Image from 'next/image';
import UserImage from '../../../../../../../public/assets/common/user.png';
import DeleteImage from '../../../../../../../public/assets/common/delete.svg';
import AgendaImage from '../../../../../../../public/assets/pages/agenda/agenda.svg';
import EditImage from '../../../../../../../public/assets/common/edit.svg';
import { LeadProps, Lead, StatusReuniao } from "@/types/interfaces";
import ScheduleMeetingForm from '@/app/components/Modal/meeting/ScheduleMeetingForm';
import EditLeadForm from '@/app/components/leads/EditLeadForm';
import Tippy from '@tippyjs/react';
import InputMask from 'react-input-mask-next';
import 'tippy.js/dist/tippy.css';
import '@/app/(styles)/globals.css';
import {FaWhatsapp} from "react-icons/fa";
import {getPhoneMask} from "@/utils/maskUtils";

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

const LeadComponent: React.FC<LeadProps> = ({ lead, index }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentLead, setCurrentLead] = useState(lead);

    useEffect(() => {
        setCurrentLead(lead);
        console.log("Oportunidades no lead atual:", lead);

    }, [lead]);

    const handleDeleteConfirm = () => {
        setShowConfirmModal(false);
        dispatch(deleteLead(lead.id));
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirmModal(true);
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

    const formatPhoneNumber = (phone: string): string => {
        let formattedPhone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Adicionar o código do país '55' se não estiver presente
        if (!formattedPhone.startsWith('55')) {
            formattedPhone = `55${formattedPhone}`;
        }

        return formattedPhone;
    };


    const getWhatsAppLink = (phone: string): string => {
        const formattedPhone = formatPhoneNumber(phone);
        return `https://wa.me/${formattedPhone}`;
    };
    // console.log("biruleibi", currentLead)

    return (
        <>
            <Draggable draggableId={currentLead.id} index={index}>
                {(provided) => (

                    <Tippy
                        content={
                            <div>
                                <h2>Informações importantes</h2>

                                <p>
                                    <strong>Indicação:</strong>{' '}
                                    {
                                        currentLead.indicado_por_detalhes
                                            ? `${currentLead.indicado_por_detalhes.nome} (${currentLead.indicado_por_detalhes.tipo})`
                                            : 'Nenhuma indicação registrada'
                                    }
                                </p>

                                <p>
                                    <strong>Oportunidades:</strong>{' '}
                                    {currentLead.oportunidades && currentLead.oportunidades.length > 0 ? (
                                        <ul style={{
                                            margin: '0',
                                            padding: '0',
                                            listStyleType: 'disc',
                                            marginLeft: '20px'
                                        }}>
                                            {currentLead.oportunidades.map((oportunidade, index) => (
                                                <li key={index}>
                                                    <strong>{oportunidade.produto_interesse}</strong>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'Nenhuma oportunidade registrada'
                                    )}
                                </p>
                                <p><strong>E-mail:</strong> {currentLead.email || 'Não informado'}</p>
                                <p className={styles.phoneContent}>
                                    <strong>Telefone:</strong>{' '}
                                    <a
                                        href={getWhatsAppLink(currentLead.telefone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.phoneAnchor}
                                    >
                                        <FaWhatsapp size={16}/>
                                        <InputMask
                                            mask={getPhoneMask(currentLead.telefone)}
                                            value={currentLead.telefone}
                                            readOnly
                                            className={styles.phoneInput} // Estilo personalizado
                                        />
                                    </a>
                                </p>
                                <p>
                                    <strong>Observações:</strong>{" "}
                                    {currentLead?.observacoes && currentLead.observacoes.trim() !== ""
                                        ? currentLead.observacoes
                                        : "Nenhuma observação"}
                                </p>

                            </div>
                        }
                        theme="custom"
                        animation="scale"
                        arrow={true}
                        maxWidth={500}
                        placement="top"
                        delay={[300, 200]} // Atraso para exibir e esconder [show, hide]
                        interactive={true} // Permite interações no conteúdo do tooltip
                        appendTo={document.body} // Resolve o problema de corte
                    >
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.lead}
                        >
                            <div className={styles.leadCell}>
                                <div className={styles.leadCard}>
                                    <div className={styles.leadContent}>
                                        <Image className={styles.userImage} src={UserImage} alt="user" priority/>
                                        <div className={styles.leadContentText}>
                                            <p>{currentLead.nome}</p>
                                            <h2 style={{color: statusColors[currentLead.status_reuniao]}}>
                                                {statusLabels[currentLead.status_reuniao]}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className={styles.actions}>
                                        <Image
                                            src={AgendaImage}
                                            alt="Schedule"
                                            className={styles.actionIcon}
                                            onClick={handleScheduleClick}
                                            priority
                                        />
                                        <Image
                                            src={EditImage}
                                            alt="Edit"
                                            className={styles.actionIcon}
                                            onClick={handleEditClick}
                                            priority
                                        />
                                        <Image
                                            src={DeleteImage}
                                            alt="Delete"
                                            className={styles.actionIcon}
                                            onClick={handleDeleteClick}
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tippy>

                )}
            </Draggable>
            <div>
            </div>
            {showConfirmModal && (
                <div className={styles.confirmModal}>
                    <div className={styles.confirmModalContent}>
                        <p>Tem certeza que deseja deletar este lead?</p>
                        <button onClick={handleDeleteConfirm}>Sim</button>
                        <button onClick={() => setShowConfirmModal(false)}>Não</button>
                    </div>
                </div>
            )}
            {showScheduleForm && (
                <ScheduleMeetingForm
                    entityId={currentLead.id}
                    entityName={currentLead.nome}
                    entityType="lead"
                    onClose={handleScheduleFormClose}
                />
            )}
            {showEditForm && (
                <EditLeadForm
                    lead={currentLead}
                    onClose={handleEditFormClose}
                    onUpdate={handleUpdateLead}
                />
            )}
        </>
    );
};

export default LeadComponent;