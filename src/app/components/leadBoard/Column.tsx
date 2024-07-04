import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import Lead from './Lead';
import styles from './LeadBoard.module.css';

interface Lead {
    id: string;
    status: string;
    name: string;
    pipeline_stage?: string;
    email?: string;
    telefone?: string;
}

interface ColumnProps {
    column: {
        id: string;
        title: string;
        leadIds: string[];
    };
    leads: { [key: string]: Lead };
    index: number;
    handleLeadClick: (leadId: string) => void;
    handleLeadDragStart: () => void;
}

const Column: React.FC<ColumnProps> = ({ column, leads, index, handleLeadClick, handleLeadDragStart }) => {
    const isLastColumn = column.id === 'column-4'; // Identifique a última coluna

    if (!column || !column.id) {
        console.error('Column or column.id is undefined', column);
        return null;
    }

    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={styles.column}
                >
                    <h3>{column.title}</h3>
                    <Droppable droppableId={column.id} type="LEAD">
                        {(provided) => (
                            <div className={styles.leadList} {...provided.droppableProps} ref={provided.innerRef}>
                                {(column.leadIds || []).map((leadId, index) => (
                                    <Lead
                                        key={leadId}
                                        lead={leads[leadId]}
                                        index={index}
                                        handleLeadClick={handleLeadClick}
                                        handleLeadDragStart={handleLeadDragStart}
                                        isLastColumn={isLastColumn} // Passe a prop para o componente Lead
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};

export default Column;
