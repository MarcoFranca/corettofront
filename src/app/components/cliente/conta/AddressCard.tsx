import React, { useState } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from './ClientProfile.module.css';
import { useAppDispatch } from '@/hooks/hooks';
import { updateCliente } from '@/store/slices/clientesSlice';
import Image from "next/image";
import AddressImage from "../../../../../public/assets/pages/profile/Endereco.svg";

interface AddressCardProps {
    cliente: Cliente;
}

const AddressCard: React.FC<AddressCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = (data: any) => {
        dispatch(updateCliente({ id: cliente.id, updatedCliente: data }));
        closeModal();
    };

    return (
        <div className={styles.profileSection}>
            <div className={styles.cardHeader}>
                <div className={styles.titleHeader}>
                    <Image src={AddressImage} alt={'Endereço'} className={styles.titleImage} />
                    <h3 className={styles.sectionTitle}>Endereço</h3>
                </div>
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
                    endereco: {
                        cep: cliente.endereco?.cep || '',
                        logradouro: cliente.endereco?.logradouro || '',
                        numero: cliente.endereco?.numero || '',
                        cidade: cliente.endereco?.cidade || '',
                        uf: cliente.endereco?.uf || '',
                    }
                }}
                onSave={handleSave}
            />
        </div>
    );
};

export default AddressCard;
