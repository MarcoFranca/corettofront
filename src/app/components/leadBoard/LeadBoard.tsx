import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { createLead, fetchLeads } from '@/store/slices/leadsSlice';
import { initializeData, handleDragEnd } from './leadBoardUtils';
import Column from './Column';
import LeadModal from '@/app/components/Modal/LeadModal';
import CadastroLead from '../../../../public/assets/pages/leads/cadastroLead.svg';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/hooks'; // Para detectar mobile

import styles from './LeadBoard.module.css';
import LeadCard from "@/app/(pages)/dashboard/lead/[leadId]/LeadCard";

const LeadBoard: React.FC = () => {
    const dispatch = useAppDispatch();
    const leadsFromStore = useAppSelector((state) => state.leads.leads);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState(() => initializeData());
    const router = useRouter();
    const tooltipContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)'); // Detecta mobile

    useEffect(() => {
        if (leadsFromStore.length === 0) {
            dispatch(fetchLeads({ status: 'lead' }));
        }
    }, [dispatch, leadsFromStore.length]);

    useEffect(() => {
        if (leadsFromStore.length > 0) {
            const updatedData = initializeData(leadsFromStore);
            setData(updatedData);
        }
    }, [leadsFromStore]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLeadSubmit = async (leadData: any) => {
        await dispatch(createLead(leadData));
        closeModal();
    };

    const onDragEnd = (result: DropResult) => {
        handleDragEnd(result, data, setData, leadsFromStore, dispatch);
    };

    if (isMobile) {
        // Layout para Mobile
        return (
            <div className={styles.container}>
                <div className={styles.headerBar}>
                    <Image src={CadastroLead} alt="Cadastro" className={styles.button} onClick={openModal} />
                </div>
                <div className={styles.mobileBoard}>
                    {Object.values(data.leads).map((lead) => (
                        <LeadCard key={lead.id} lead={lead} columns={Object.values(data.columns)} />
                    ))}
                </div>
                <LeadModal isOpen={modalIsOpen} onRequestClose={closeModal} onSubmit={handleLeadSubmit} />
            </div>
        );
    }

    // Layout para Desktop
    return (
        <div className={styles.container}>
            <div ref={tooltipContainerRef} className={styles.tooltipContainer} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                    {(provided) => (
                        <div>
                            <div className={styles.headerBar}>
                                <Image src={CadastroLead} alt="Cadastro" className={styles.button} onClick={openModal} />
                            </div>
                            <div className={styles.board} {...provided.droppableProps} ref={provided.innerRef}>
                                {data.columnOrder.map((columnId, index) => {
                                    const column = data.columns[columnId];
                                    if (!column) {
                                        console.error('Column is undefined', columnId);
                                        return null;
                                    }

                                    return (
                                        <Column
                                            key={columnId}
                                            column={column}
                                            leads={data.leads}
                                            index={index}
                                            handleLeadClick={(leadId) => router.push(`/dashboard/cliente/${leadId}`)}
                                            handleLeadDragStart={() => {}}
                                            tooltipContainerRef={tooltipContainerRef}
                                        />
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <LeadModal isOpen={modalIsOpen} onRequestClose={closeModal} onSubmit={handleLeadSubmit} />
        </div>
    );
};

export default LeadBoard;
