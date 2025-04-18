'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import { fetchTodosClientesFiltrados} from '@/store/slices/clientesSlice';
import { initializeData, handleDragEnd } from './leadBoardUtils';
import Column from './Column';
import LeadModal from '@/app/components/Modal/LeadModal';
import CadastroLead from '../../../../../../../public/assets/pages/leads/cadastroLead.svg';
import Image from 'next/image';
import { useMediaQuery } from '@/services/hooks/hooks';
import styles from './LeadBoard.module.css';
import {
    Board,
    Container,
    StackedColumns,
    StackedColumnsVerticalSup
} from "@/app/(pages)/dashboard/(painel_admin)/lead/leadBoard/LeadBoard.styles";

const LeadBoard: React.FC = () => {
    const dispatch = useAppDispatch();
    const leadsFromStore = useAppSelector((state) => state.clientes.clientes);
    const status = useAppSelector((state) => state.clientes.status);
    const [data, setData] = useState(() => initializeData(leadsFromStore || []));
    const [filter, setFilter] = useState('all'); // Filtro selecionado
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const router = useRouter();
    const tooltipContainerRef = useRef<HTMLDivElement | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Sempre busca os leads do backend ao montar o componente
    useEffect(() => {
       const teste = dispatch(fetchTodosClientesFiltrados({ status: ["lead", "negociacao", "nova_negociacao"] }));
       console.log("leads carregados",teste)
    }, [dispatch]);


    useEffect(() => {
        if (status === 'succeeded' && Array.isArray(leadsFromStore) && leadsFromStore.length > 0) {
            console.log('Leads carregados do Redux:', leadsFromStore);

            const updatedData = initializeData(leadsFromStore);
            console.log('Dados atualizados para o Board:', updatedData);

            setData(updatedData);
        } else {
            console.warn("Leads ainda não foram carregados ou a lista está vazia.");
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

    if (!leadsFromStore || !Array.isArray(leadsFromStore)) {
        return <p>Carregando leads...</p>;
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
        <Container>
            <div ref={tooltipContainerRef} className={styles.tooltipContainer} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                    {(provided) => (
                        <Board {...provided.droppableProps} ref={provided.innerRef}>

                            {/* 📌 Renderiza as colunas normais */}
                            {data.columnOrder.slice(0, 4).map((columnId, index) => {
                                const column = data.columns[columnId];
                                return (
                                    <div className={styles.horizontalColumns}>
                                        <Column
                                            key={columnId}
                                            column={column}
                                            leads={data.leads}
                                            index={index}
                                            handleLeadClick={(leadId) => router.push(`/dashboard/cliente/${leadId}`)}
                                            handleLeadDragStart={() => {}}
                                            tooltipContainerRef={tooltipContainerRef as React.RefObject<HTMLDivElement>}
                                        />
                                    </div>
                                );
                            })}

                            {/* 📌 Renderiza as colunas "Clientes Ativos" e "Clientes Perdidos" uma em cima da outra */}
                            <StackedColumns>
                                {data.columnOrder.slice(4,5).map((columnId, index) => {
                                    const column = data.columns[columnId];
                                    return (
                                        <StackedColumnsVerticalSup key={columnId}>
                                            <Column
                                                key={columnId}
                                                column={column}
                                                leads={data.leads}
                                                index={index}
                                                handleLeadClick={(leadId) => router.push(`/dashboard/cliente/${leadId}`)}
                                                handleLeadDragStart={() => {}}
                                                tooltipContainerRef={tooltipContainerRef as React.RefObject<HTMLDivElement>}
                                            />
                                        </StackedColumnsVerticalSup>
                                    );
                                })}
                                {data.columnOrder.slice(5).map((columnId, index) => {
                                    const column = data.columns[columnId];
                                    return (
                                        <StackedColumnsVerticalSup key={columnId}>

                                            <Column
                                                key={columnId}
                                                column={column}
                                                leads={data.leads}
                                                index={index}
                                                handleLeadClick={(leadId) => router.push(`/dashboard/cliente/${leadId}`)}
                                                handleLeadDragStart={() => {}}
                                                tooltipContainerRef={tooltipContainerRef as React.RefObject<HTMLDivElement>}
                                            />
                                        </StackedColumnsVerticalSup>
                                    );
                                })}
                            </StackedColumns>

                            {provided.placeholder}
                        </Board>
                    )}
                </Droppable>
            </DragDropContext>

            {/*<LeadModal isOpen={modalIsOpen} onRequestClose={closeModal} />*/}
        </Container>
    );
};

export default LeadBoard;