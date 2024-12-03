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
import { useMediaQuery } from '@/hooks/hooks';
import styles from './LeadBoard.module.css';
import LeadCard from "@/app/(pages)/dashboard/lead/[leadId]/LeadCard";

const LeadBoard: React.FC = () => {
    const dispatch = useAppDispatch();
    const leadsFromStore = useAppSelector((state) => state.leads.leads);
    const status = useAppSelector((state) => state.leads.status);
    const [data, setData] = useState(() => initializeData([])); // Inicializa vazio
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const router = useRouter();
    const tooltipContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Dispara ação para buscar leads ao carregar o componente
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchLeads({ status: 'lead' }));
        }
    }, [dispatch, status]);

    // Atualiza os dados locais quando os leads são carregados
    useEffect(() => {
        if (status === 'succeeded' && leadsFromStore.length > 0) {
            const updatedData = initializeData(leadsFromStore);
            setData(updatedData);
        }
    }, [leadsFromStore, status]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleLeadSubmit = async (leadData: any) => {
        await dispatch(createLead(leadData));
        closeModal();
    };

    const onDragEnd = (result: DropResult) => {
        handleDragEnd(result, data, setData, leadsFromStore, dispatch);
    };

    // Renderizações condicionais para lidar com estados de carregamento e erro
    if (status === 'loading') {
        return <p>Carregando leads...</p>;
    }

    if (status === 'failed') {
        return <p>Erro ao carregar leads. Tente novamente mais tarde.</p>;
    }

    if (!leadsFromStore || leadsFromStore.length === 0) {
        return <p>Nenhum lead disponível.</p>;
    }

    if (isMobile) {
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
