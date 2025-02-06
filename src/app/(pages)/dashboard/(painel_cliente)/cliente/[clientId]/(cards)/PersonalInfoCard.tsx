import React, { useState } from 'react';
import EditClientModal from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/EditClientModal';
import { Cliente } from '@/types/interfaces';
import styles from '../(CustomerComponents)/ClientProfile.module.css';
import { useAppDispatch } from '@/hooks/hooks';
import { updateCliente } from '@/store/slices/clientesSlice';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importa o locale pt-BR
import NascimentoImage from '../../../../../../../../public/assets/common/Aniversario.svg';
import GeneroImage from '../../../../../../../../public/assets/common/gender.svg';
import JobImage from '../../../../../../../../public/assets/pages/profile/job.svg';
// idade
import BebeImage from '../../../../../../../../public/assets/pages/profile/bebe.svg';
import CriancaImage from '../../../../../../../../public/assets/pages/profile/crianca.svg';
import AdultoImage from '../../../../../../../../public/assets/pages/profile/adulto.svg';
import IdosoImage from '../../../../../../../../public/assets/pages/profile/Idoso.svg';
import PersonalImage from '../../../../../../../../public/assets/pages/profile/personalInfo.svg';
import EditImage from '../../../../../../../../public/assets/common/edit.svg';
import Image from "next/image";

interface PersonalInfoCardProps {
    cliente: Cliente;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ cliente }) => {
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

    const formatDate = (date: string | undefined) => {
        return date ? moment(date).format('DD/MM/YYYY') : 'Não informada';
    };

    const ageImage = (clienteAge: string | undefined) => {
        if (clienteAge && parseInt(clienteAge) <= 8) {
            return BebeImage;
        }
        if (clienteAge && parseInt(clienteAge) <= 18) {
            return CriancaImage;
        }
        if (clienteAge && parseInt(clienteAge) <= 60) {
            return AdultoImage;
        }
        return IdosoImage;
    };

    return (
        <div className={styles.profileSection}>
            <div className={styles.cardHeader}>
                <div className={styles.titleHeader}>
                    <Image src={PersonalImage} alt={'Dados Pessoais'} className={styles.titleImage} priority />
                    <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
                </div>
                <Image src={EditImage} alt={"Editar"} className={styles.editIcon} onClick={openModal} priority />
            </div>
            <div className={styles.personalSectionContainer}>
                <div className={styles.profileCellRow}>
                    <div className={styles.nascimentoCell}>
                        <Image src={NascimentoImage} alt="Aniversário" className={styles.StaticIcon} priority />
                        <p>{formatDate(cliente.data_nascimento)}</p>
                    </div>
                    <div className={styles.nascimentoCell}>
                        <Image src={ageImage(cliente.idade) } alt="Idade" className={styles.StaticIcon} priority />
                        <p>{`${cliente.idade} anos` || 'Não informada'}</p>
                    </div>
                </div>
                <div className={styles.profileCellRow}>
                    <div className={styles.nascimentoCell}>
                        <Image src={GeneroImage} alt="Gênero" className={styles.StaticIcon} priority />
                        <p>{cliente.genero === 'M' ? 'Masculino' : 'Feminino'}</p>
                    </div>
                    <div className={styles.nascimentoCell}>
                        <Image src={JobImage} alt="Profissão" className={styles.StaticIcon} priority />
                        <p><strong>Profissão:</strong> {cliente.profissao?.nome || "Não especificada"}</p>
                    </div>
                </div>
            </div>

            <EditClientModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                initialData={{
                    data_nascimento: cliente.data_nascimento,
                    sexo: cliente.genero,
                    profissao: cliente.profissao,
                }}
                onSave={handleSave}
            />
        </div>
    );
};

export default PersonalInfoCard;
