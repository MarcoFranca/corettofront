import React, { useState } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from '@/app/components/cliente/conta/ClientProfile.module.css';
import { useAppDispatch } from '@/hooks/hooks';
import { updateCliente } from '@/store/slices/clientesSlice';
import EmailImage from "@/../public/assets/common/mail.svg";
import TellImage from "@/../public/assets/common/whats.svg";
import Image from "next/image";
import Link from "next/link";
import ContatoImage from "../../../../../public/assets/pages/profile/Contato.svg";
import EditImage from "../../../../../public/assets/common/edit.svg";
import {formatPhoneNumber} from "@/utils/utils";

interface ContactInfoCardProps {
    cliente: Cliente;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ cliente }) => {
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

    const formatValue = (value: any, placeholder: string) => {
        return value ? value : placeholder;
    };

    return (
        <div className={styles.profileSection}>
            <div className={styles.cardHeader}>
                <div className={styles.titleHeader}>
                    <Image src={ContatoImage} alt={'Contato'} className={styles.titleImage}/>
                    <h3 className={styles.sectionTitle}>Contato</h3>
                </div>
                <Image src={EditImage} alt={"Editar"} className={styles.editIcon} onClick={openModal} priority/>
            </div>
            <div className={styles.profileContactRow}>
                <Link href={`mailto:${cliente.email}`} className={styles.profileCellRow}>
                    <Image src={EmailImage} alt="Foto do Cliente" className={styles.IconImage} priority/>
                    <p> {formatValue(cliente.email, 'Não informado')}</p>
                </Link>
                <Link href={`https://wa.me/+55${cliente.telefone}`} className={styles.profileCellRow}>
                    <Image src={TellImage} alt="Foto do Cliente" className={styles.IconImage} priority/>

                    <p>{formatValue(formatPhoneNumber(cliente.telefone), 'Não informado')}</p>

                </Link>
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
