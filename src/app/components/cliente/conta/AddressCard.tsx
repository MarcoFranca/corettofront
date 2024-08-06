// components/cliente/conta/DocumentInfoCard.tsx
import React, { useState } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from './ClientProfile.module.css';


interface DocumentInfoCardProps {
    cliente: Cliente;
}

const AddressCard: React.FC<DocumentInfoCardProps> = ({ cliente }) => {
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
                    <h3 className={styles.sectionTitle}>Endereço</h3>
                    <button onClick={openModal}>Editar</button>
                </div>
                <div className={styles.profileCellRow}>
                    <p><strong>Rua:</strong> {cliente.endereco?.logradouro || 'Não informada'}</p>
                    <p><strong>Número:</strong> {cliente.endereco?.numero || 'Não informado'}</p>
                </div>
                <div className={styles.profileCellRow}>
                    <p><strong>Cidade:</strong> {cliente.endereco?.cidade || 'Não informada'}</p>
                    <p><strong>UF:</strong> {cliente.endereco?.uf || 'Não informado'}</p>
                    <p><strong>CEP:</strong> {cliente.endereco?.cep || 'Não informado'}</p>
                </div>
                <EditClientModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    initialData={{
                        endereço: cliente.endereco
                    }}
                    onSave={handleSave}
                />
            </div>
    );
};

export default AddressCard;
