import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import Lead from './Lead';
import styles from './LeadBoard.module.css';
import { ColumnProps } from "@/types/interfaces";

const Column: React.FC<ColumnProps> = ({ column, leads, index, handleLeadClick, handleLeadDragStart, tooltipContainerRef }) => {
    const isLastColumn = column.id === 'column-4';

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
                                <div className={styles.fadeTop}></div>
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
                                        isLastColumn={isLastColumn}
                                        tooltipContainerRef={tooltipContainerRef} // Passe a ref do contêiner de tooltips para o Lead
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                                <div className={styles.fadeBottom}></div>
                </div>
            )}
        </Draggable>
    );
};

export default Column;
