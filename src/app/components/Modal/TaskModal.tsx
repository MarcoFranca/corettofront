// components/modal/TaskModal.tsx
import React from 'react';
import Modal from 'react-modal';
import styles from './TaskModal.module.css';

interface TaskModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onRequestClose, children }) => {
    return (
        <Modal
            isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Task Modal"
    className={styles.modalContent}
    overlayClassName={styles.modalOverlay}
        >
        {children}
        <button onClick={onRequestClose} className={styles.closeModalButton}>Fechar</button>
        </Modal>
);
};

export default TaskModal;
