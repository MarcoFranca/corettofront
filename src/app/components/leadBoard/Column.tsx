import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
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
        <div className={styles.column}>
            <h3>{column.title}</h3>
            <div className={styles.titleBoard} />
            <div className={styles.fadeTop} />
            <Droppable droppableId={column.id} type="LEAD">
                {(provided) => (
                    <div className={styles.leadList} {...provided.droppableProps} ref={provided.innerRef}>
                        {column.leadIds.map((leadId, index) => (
                            <Lead
                                key={leadId}
                                lead={leads[leadId]}
                                index={index}
                                handleLeadClick={handleLeadClick}
                                handleLeadDragStart={handleLeadDragStart}
                                isLastColumn={isLastColumn}
                                tooltipContainerRef={tooltipContainerRef}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <div className={styles.fadeBottom}></div>
        </div>
    );
};

export default Column;
