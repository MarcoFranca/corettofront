// components/cliente/conta/PersonalInfoCard.tsx
import React, { useState } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from "@/app/components/cliente/conta/ClientProfile.module.css";

interface PersonalInfoCardProps {
    cliente: Cliente;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ cliente }) => {
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
                <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
                <button onClick={openModal}>Editar</button>
            </div>
            <div className={styles.profileCellRow}>
                <p><strong>Data de Nascimento:</strong> {cliente.data_nascimento || 'Não informada'}</p>
                <p><strong>Sexo:</strong> {cliente.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
            </div>
            <div className={styles.profileCellRow}>
                <p><strong>Profissão:</strong> {cliente.profissao || 'Não informada'}</p>
                <p><strong>Idade:</strong> {cliente.idade || 'Não informada'}</p>
            </div>
            <EditClientModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                initialData={{
                    data_nascimento: cliente.data_nascimento,
                    sexo: cliente.sexo,
                    profissao: cliente.profissao,
                }}
                onSave={handleSave}
            />
        </div>
    );
};

export default PersonalInfoCard;
