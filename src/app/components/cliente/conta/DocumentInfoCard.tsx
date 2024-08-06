// components/cliente/conta/DocumentInfoCard.tsx
import React, { useState } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from './ClientProfile.module.css';


interface DocumentInfoCardProps {
    cliente: Cliente;
}

const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = (data: any) => {
        // Dispatch updateCliente action here
        closeModal();
    };

    return (

            <div className={styles.profileSection}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.sectionTitle}>Documentos</h3>
                    <button onClick={openModal}>Editar</button>
                </div>
                <div className={styles.profileCellRow}>
                    <p><strong>CPF:</strong> {cliente.cpf || 'Não informado'}</p>
                    <p><strong>Identidade:</strong> {cliente.identidade || 'Não informada'}</p>
                </div>
                <EditClientModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    initialData={{
                        cpf: cliente.cpf,
                        identidade: cliente.identidade,
                    }}
                    onSave={handleSave}
                />
            </div>

    );
};

export default DocumentInfoCard;
