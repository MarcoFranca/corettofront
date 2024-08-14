import React, { useState, useEffect } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from './ClientProfile.module.css';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { updateCliente } from '@/store/slices/clientesSlice';
import Image from "next/image";
import DocumentosImage from '@/../public/assets/pages/profile/Documentos.svg';
import EditImage from "../../../../../public/assets/common/edit.svg";
import { applyCPFMask, formatIdentity } from '@/utils/utils';
import {RootState} from "@/store"; // Importa as funções de máscara

interface DocumentInfoCardProps {
    cliente: Cliente;
}

const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const error = useAppSelector((state: RootState) => state.clientes.error);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = (data: any) => {
        const payload = {
            identidade: data.identidade,
        };
        dispatch(updateCliente({ id: cliente.id, updatedCliente: payload }))
            .unwrap()
            .then(() => closeModal())
            .catch((error) => console.error('Erro ao atualizar cliente:', error));
    };

    return (
        <div className={styles.profileSection}>
            <div className={styles.cardHeader}>
                <div className={styles.titleHeader}>
                    <Image src={DocumentosImage} alt={'Documentos'} className={styles.titleImage} />
                    <h3 className={styles.sectionTitle}>Documentos</h3>
                </div>
                <Image src={EditImage} alt={"Editar"} className={styles.editIcon} onClick={openModal} priority />
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>} {/* Exibir mensagem de erro */}
            <div className={styles.profileCellRow}>
                <p><strong>CPF:</strong> {cliente.cpf ? applyCPFMask(cliente.cpf) : 'Não informado'}</p>
                <p><strong>ID:</strong> {cliente.identidade ? formatIdentity(cliente.identidade) : 'Não informada'}</p>
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
