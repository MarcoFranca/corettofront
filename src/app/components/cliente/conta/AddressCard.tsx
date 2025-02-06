import React, { useState } from 'react';
import EditClientModal from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from './ClientProfile.module.css';
import { useAppDispatch } from '@/hooks/hooks';
import { updateCliente } from '@/store/slices/clientesSlice';
import Image from "next/image";
import AddressImage from "../../../../../public/assets/pages/profile/Endereco.svg";
import EditImage from "../../../../../public/assets/common/edit.svg";

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
                <Image src={EditImage} alt={"Editar"} className={styles.editIcon} onClick={openModal} priority />
            </div>
            <div className={styles.profileCellContainer}>
                <div className={styles.profileCellRow}>
                    <p><strong>Endereço:</strong> {cliente.endereco?.logradouro || 'Não informada'}</p>
                </div>
                <div className={styles.profileCellRow}>
                    <p><strong>Nº:</strong> {cliente.endereco?.numero || 'Não informado'}</p>
                    <p><strong>Comp:</strong> {cliente.endereco?.complemento || 'Não informado'}</p>
                    <p><strong>Bairro:</strong> {cliente.endereco?.bairro || 'Não informado'}</p>
                </div>
                <div className={styles.profileCellRow}>
                </div>
                <div className={styles.profileCellRow}>
                    <p><strong>Cidade:</strong> {cliente.endereco?.cidade || 'Não informada'}</p>
                    <p><strong>UF:</strong> {cliente.endereco?.uf || 'Não informado'}</p>
                    <p><strong>CEP:</strong> {cliente.endereco?.cep || 'Não informado'}</p>
                </div>
            </div>
            <EditClientModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                initialData={{
                    endereco: {
                        cep: cliente.endereco?.cep || '',
                        logradouro: cliente.endereco?.logradouro || '',
                        numero: cliente.endereco?.numero || '',
                        complemento: cliente.endereco?.complemento || '',
                        bairro: cliente.endereco?.bairro || '',
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
