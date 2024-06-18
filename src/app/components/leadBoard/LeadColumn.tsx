import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import LeadCard from './LeadCard';
import styles from './LeadColumn.module.css';

const LeadColumn = ({ column, leads }: any) => {
    return (
        <div className={styles.column}>
            <h2 className={styles.title}>{column.title}</h2>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        className={styles.leadList}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {leads.map((lead: any, index: number) => (
                            <LeadCard key={lead.id} lead={lead} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default LeadColumn;
