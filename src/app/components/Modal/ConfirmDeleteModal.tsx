// ConfirmDeleteModal.tsx
import React from 'react';
import ReactModal from 'react-modal';
import styles from './ConfirmDeleteModal.module.css';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onRequestClose, onConfirm }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
        >
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja deletar esta tarefa?</p>
            <div className={styles.buttons}>
                <button onClick={onConfirm} className={styles.confirmButton}>Sim</button>
                <button onClick={onRequestClose} className={styles.cancelButton}>Não</button>
            </div>
        </ReactModal>
    );
};

export default ConfirmDeleteModal;
