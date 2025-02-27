import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchLeads } from '@/store/slices/leadsSlice';
import { initializeData, handleDragEnd } from './leadBoardUtils';
import Column from './Column';
import LeadModal from '@/app/components/Modal/LeadModal';
import CadastroLead from '../../../../../../../public/assets/pages/leads/cadastroLead.svg';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/hooks';
import styles from './LeadBoard.module.css';
import Spinner from "@/app/components/common/spinner/sppiner";

const LeadBoard: React.FC = () => {
    const dispatch = useAppDispatch();
    const leadsFromStore = useAppSelector((state) => state.leads.leads);
    const status = useAppSelector((state) => state.leads.status);
    const [data, setData] = useState(() => initializeData(leadsFromStore || []));
    const [filter, setFilter] = useState('all'); // Filtro selecionado
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const router = useRouter();
    const tooltipContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Sempre busca os leads do backend ao montar o componente
    useEffect(() => {
        dispatch(fetchLeads({ status: ['lead', 'negociacao', 'nova_negociacao'] }));
    }, [dispatch]);


    // Atualiza os dados locais quando os leads são carregados
    useEffect(() => {
        if (status === 'succeeded' && Array.isArray(leadsFromStore) && leadsFromStore.length > 0) {
            console.log('Leads carregados do Redux:', leadsFromStore);

            const updatedData = initializeData(leadsFromStore);
            console.log('Dados atualizados para o Board:', updatedData);
            setData(updatedData);
        }
    }, [leadsFromStore, status]);


    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const onDragEnd = (result: DropResult) => {
        handleDragEnd(result, data, setData, leadsFromStore, dispatch);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value.toLowerCase());
    };

    // Renderizações condicionais para estados
    if (status === 'loading') {
        return (<Spinner text={'Carregando leads...'}/>)
    }

    if (status === 'failed') {
        return (
            <div className={styles.containerStatus}>
                <div className={styles.alertText}>
                    <p>⚠️ Erro ao carregar leads.</p>
                    <p>Tente novamente mais tarde.🥺</p>
                </div>
                <button className={styles.buttonError} onClick={ ()=> router.push(`/dashboard/perfil/`)}>
                    Ir para o Dashboard
                </button>
            </div>
        )
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
                <LeadModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <Image src={CadastroLead} alt="Cadastro" className={styles.button} onClick={openModal} />
            </div>
            <div ref={tooltipContainerRef} className={styles.tooltipContainer} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                    {(provided) => (
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
                    )}
                </Droppable>
            </DragDropContext>
            <LeadModal isOpen={modalIsOpen} onRequestClose={closeModal} />
        </div>
    );
};

export default LeadBoard;