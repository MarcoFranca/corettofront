'use client'
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import LeadColumn from './LeadColumn';
import styles from './LeadBoard.module.css';

interface Lead {
    id: string;
    content: string;
}

interface Column {
    id: string;
    title: string;
    leadIds: string[];
}

interface BoardData {
    leads: {
        [key: string]: Lead;
    };
    columns: {
        [key: string]: Column;
    };
    columnOrder: string[];
}

const initialData: BoardData = {
    leads: {
        'lead-1': { id: 'lead-1', content: 'Consulta de Marketing' },
        'lead-2': { id: 'lead-2', content: 'Sessão de estratégia' },
        // Adicione mais leads aqui
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'Leads de Entrada',
            leadIds: ['lead-1', 'lead-2'],
        },
        'column-2': {
            id: 'column-2',
            title: 'Decidindo',
            leadIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Discussão de Contrato',
            leadIds: [],
        },
        'column-4': {
            id: 'column-4',
            title: 'Decisão Final',
            leadIds: [],
        },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

const LeadBoard = () => {
    const [data, setData] = useState<BoardData>(initialData);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = data.columns[source.droppableId as keyof typeof data.columns];
        const finish = data.columns[destination.droppableId as keyof typeof data.columns];

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
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.board}>
                {data.columnOrder.map((columnId) => {
                    const column = data.columns[columnId];
                    const leads = column.leadIds.map((leadId) => data.leads[leadId]);

                    return <LeadColumn key={column.id} column={column} leads={leads} />;
                })}
            </div>
        </DragDropContext>
    );
};

export default LeadBoard;
