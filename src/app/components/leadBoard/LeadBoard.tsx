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
    const [data, setData] = useState(() => initializeData([]));
    const [filter, setFilter] = useState('all'); // Filtro selecionado
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const router = useRouter();
    const tooltipContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Sempre busca os leads do backend ao montar o componente
    useEffect(() => {
        dispatch(fetchLeads({ status: 'lead' }));
    }, [dispatch]);

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
        await dispatch(fetchLeads({ status: 'lead' })); // Recarrega os leads do backend
        closeModal();
    };

    const onDragEnd = (result: DropResult) => {
        handleDragEnd(result, data, setData, leadsFromStore, dispatch);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value.toLowerCase());
    };

    const filteredLeads = Object.values(data.leads).filter((lead) => {
        if (filter === 'all') return true; // Mostra todos os leads
        return lead.pipeline_stage?.toLowerCase() === filter;
    });

    // Renderizações condicionais para estados
    if (status === 'loading') {
        return <p>Carregando leads...</p>;
    }

    if (status === 'failed') {
        return <p>Erro ao carregar leads. Tente novamente mais tarde.</p>;
    }

    if (isMobile) {
        return (
            <div className={styles.container}>
                <div className={styles.headerBar}>
                    <Image src={CadastroLead} alt="Cadastro" className={styles.button} onClick={openModal} />
                    <select
                        className={styles.filterDropdown}
                        value={filter}
                        onChange={handleFilterChange}
                    >
                        <option value="all">Todos</option>
                        <option value="leads de entrada">Leads de Entrada</option>
                        <option value="negociando">Negociando</option>
                        <option value="finalização">Finalização</option>
                        <option value="pouco interesse">Pouco Interesse</option>
                    </select>
                </div>
                <div className={styles.mobileBoard}>
                    {filteredLeads.map((lead) => (
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
