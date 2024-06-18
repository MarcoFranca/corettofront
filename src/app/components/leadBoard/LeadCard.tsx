import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './LeadCard.module.css';

const LeadCard = ({ lead, index }: any) => {
    return (
        <Draggable draggableId={lead.id} index={index}>
        {(provided) => (
        <div
            className={styles.card}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    ref={provided.innerRef}
        >
        {lead.content}
        </div>
)}
    </Draggable>
);
};

export default LeadCard;
