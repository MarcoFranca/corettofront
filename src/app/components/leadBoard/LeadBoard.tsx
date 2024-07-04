'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchLeads, updateLead } from '@/store/slices/leadsSlice';
import { initializeData, handleDragEnd } from './leadBoardUtils';
import Column from './Column';
import styles from './LeadBoard.module.css';

const LeadBoard: React.FC = () => {
    const dispatch = useAppDispatch();
    const leadsFromStore = useAppSelector((state) => state.leads.leads);

    const [data, setData] = useState(initializeData());
    const router = useRouter();
    let clickTimer: NodeJS.Timeout | null = null;

    useEffect(() => {
        dispatch(fetchLeads());
    }, [dispatch]);

    useEffect(() => {
        const updatedData = initializeData(leadsFromStore);
        setData(updatedData);
    }, [leadsFromStore]);

    const onDragEnd = (result: DropResult) => {
        handleDragEnd(result, data, setData, leadsFromStore, dispatch);
    };

    const handleLeadClick = (leadId: string) => {
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            router.push(`/lead/${leadId}`);
        }, 200);
    };

    const handleLeadDragStart = () => {
        if (clickTimer) clearTimeout(clickTimer);
    };

    return (
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
                                    handleLeadClick={handleLeadClick}
                                    handleLeadDragStart={handleLeadDragStart}
                                />
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default LeadBoard;
