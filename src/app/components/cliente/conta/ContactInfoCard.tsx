// components/cliente/conta/ContactInfoCard.tsx
import React, { useState } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from "@/app/components/cliente/conta/ClientProfile.module.css";
import {updateCliente} from "@/store/slices/clientesSlice";

interface ContactInfoCardProps {
    cliente: Cliente;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = (data: any) => {
        // if (clientId) {
        //     dispatch(updateCliente({ id: clientId, updatedCliente: data }));
        //     closeModal();
        // }
    };

    const formatValue = (value: any, placeholder: string) => {
        return value ? value : placeholder;
    };


    return (
        <div className={styles.profileSection}>
            <div className={styles.cardHeader}>
                <h3 className={styles.sectionTitle}>Contato</h3>
                <button onClick={openModal}>Editar</button>
            </div>
            <div className={styles.profileCellRow}>
                <p><strong>Email:</strong> {formatValue(cliente.email, 'Não informado')}</p>
                <p><strong>Telefone:</strong> {formatValue(cliente.telefone, 'Não informado')}</p>
            </div>
            <EditClientModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                initialData={{
                    email: cliente.email,
                    telefone: cliente.telefone
                }}
                onSave={handleSave}
            />
        </div>
    );
};

export default ContactInfoCard;

