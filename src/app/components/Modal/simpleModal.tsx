import React, { ReactNode } from 'react';
import Button from '../global/Button';
import styles from './simpleModal.module.css';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, title }) => {
    if (!show) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    {title && <h2 className={styles.modalTitle}>{title}</h2>}
                    <Button variant="secondary" onClick={onClose}>
                        &times;
                    </Button>
                </div>
                <div className={styles.modalBody}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;