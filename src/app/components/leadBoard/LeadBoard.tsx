'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchLeads, updateLead } from '@/store/slices/leadsSlice';
import styles from './LeadBoard.module.css';
import Image from "next/image";
import UserImage from '@/../public/assets/user.png';

interface Lead {
    id: string;
    content: string;
    name: string;
}

interface Column {
    id: string;
    title: string;
    leadIds: string[];
}

interface Data {
    leads: { [key: string]: Lead };
    columns: { [key: string]: Column };
    columnOrder: string[];
}

const LeadBoard: React.FC = () => {
    const dispatch = useAppDispatch();
    const leadsFromStore = useAppSelector((state) => state.leads.leads);
    const [data, setData] = useState<Data>({
        leads: {},
        columns: {
            'column-1': { id: 'column-1', title: 'LEADS DE ENTRADA', leadIds: [] },
            'column-2': { id: 'column-2', title: 'DECIDINDO', leadIds: [] },
            'column-3': { id: 'column-3', title: 'DISCUSSÃO DE CONTRATO', leadIds: [] },
            'column-4': { id: 'column-4', title: 'DECISÃO FINAL', leadIds: [] },
        },
        columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
    });
    const router = useRouter();
    let clickTimer: NodeJS.Timeout | null = null;

    useEffect(() => {
        dispatch(fetchLeads());
    }, [dispatch]);

    useEffect(() => {
        const leads: { [key: string]: Lead } = {};
        const leadIds: string[] = [];

        leadsFromStore.forEach((lead) => {
            if (lead.id) {
                leads[lead.id.toString()] = { id: lead.id.toString(), content: lead.status, name: lead.nome };
                leadIds.push(lead.id.toString());
            }
        });

        setData((prevData) => ({
            ...prevData,
            leads,
            columns: {
                ...prevData.columns,
                'column-1': { ...prevData.columns['column-1'], leadIds },
            },
        }));
    }, [leadsFromStore]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        const start = data.columns[source.droppableId];
        const finish = data.columns[destination.droppableId];

        if (!start || !finish) return;  // Verificação adicional

        if (start === finish) {
            const newLeadIds = Array.from(start.leadIds);
            newLeadIds.splice(source.index, 1);
            newLeadIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                leadIds: newLeadIds,
            };

            const newState = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setData(newState);
            return;
        }

        const startLeadIds = Array.from(start.leadIds);
        startLeadIds.splice(source.index, 1);
        const newStart = {
            ...start,
            leadIds: startLeadIds,
        };

        const finishLeadIds = Array.from(finish.leadIds);
        finishLeadIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            leadIds: finishLeadIds,
        };

        const newState = {
            ...data,
            columns: {
                ...data.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        setData(newState);

        // Atualizar o status do lead no Redux
        const updatedLead = leadsFromStore.find(lead => lead.id?.toString() === draggableId);
        if (updatedLead) {
            const newStatus = newFinish.title;
            dispatch(updateLead({ id: parseInt(draggableId), updatedLead: { ...updatedLead, status: newStatus } }));
        }
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
            <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="COLUMN"
            >
                {(provided) => (
                    <div
                        className={styles.board}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {data.columnOrder.map((columnId, index) => {
                            const column = data.columns[columnId];
                            const leads = column.leadIds.map(
                                (leadId) => data.leads[leadId]
                            );

                            return (
                                <Draggable
                                    draggableId={column.id}
                                    index={index}
                                    key={column.id}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={styles.column}
                                        >
                                            <h3>{column.title}</h3>
                                            <Droppable
                                                droppableId={column.id}
                                                type="LEAD"
                                            >
                                                {(provided) => (
                                                    <div
                                                        className={styles.leadList}
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {leads.map((lead, index) => (
                                                            <Draggable
                                                                key={lead.id}
                                                                draggableId={lead.id}
                                                                index={index}
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={styles.lead}
                                                                        onClick={() => handleLeadClick(lead.id)}
                                                                        onDragStart={handleLeadDragStart}
                                                                    >
                                                                        <Image className={styles.userImage} src={UserImage} alt={'user'} priority/>
                                                                        <div className={styles.leadList}>
                                                                            <p>{lead.name}</p>
                                                                            <h2>{lead.content}</h2>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    )}
                                </Draggable>
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
