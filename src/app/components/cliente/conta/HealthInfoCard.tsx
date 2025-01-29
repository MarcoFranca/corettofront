import React, { useState } from 'react';
import EditHealthModal from '@/app/components/Modal/profile/EditHealthModal';
import { Cliente } from '@/types/interfaces';
import styles from './ClientProfile.module.css';
import Image from "next/image";
import EditImage from "../../../../../public/assets/common/edit.svg";
import CopyIcon from "../../../../../public/assets/common/copy.svg"; // Supondo que você tenha um ícone de copiar
import AbPesoImage from "../../../../../public/assets/imc/magro.svg";
import NormalPesoImage from "../../../../../public/assets/imc/no peso.svg";
import AcPesoImage from "../../../../../public/assets/imc/Sobrepeso.svg";
import Ob1PesoImage from "../../../../../public/assets/imc/Obesidade grau 1.svg";
import Ob2PesoImage from "../../../../../public/assets/imc/Obesidade grau 2.svg";
import AlturaImage from "../../../../../public/assets/imc/altura.svg";
import BalancaImage from "../../../../../public/assets/imc/balanca.svg";
import {FaHeartbeat} from "react-icons/fa";

interface HealthInfoCardProps {
    cliente: Cliente;
}

const HealthInfoCard: React.FC<HealthInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = () => {
        closeModal();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Texto copiado para a área de transferência");
    };

    const getImcGrauClass = (imcGrau: string | undefined) => {
        switch (imcGrau) {
            case 'Abaixo do peso':
                return styles.imcAbaixoPeso;
            case 'Peso normal':
                return styles.imcPesoNormal;
            case 'Sobrepeso':
                return styles.imcSobrepeso;
            case 'Obesidade grau 1':
                return styles.imcObesidadeGrau1;
            case 'Obesidade grau 2':
                return styles.imcObesidadeGrau2;
            case 'Obesidade grau 3':
                return styles.imcObesidadeGrau3;
            default:
                return styles.imcDesconhecido;
        }
    };

    const imageImc = (imcGrau: string) =>{
        switch (imcGrau) {
            case 'Abaixo do peso':
                return AbPesoImage;
            case 'Peso normal':
                return NormalPesoImage;
            case 'Sobrepeso':
                return AcPesoImage;
            case 'Obesidade grau 1':
                return Ob1PesoImage;
            case 'Obesidade grau 2':
                return Ob2PesoImage;
            case 'Obesidade grau 3':
                return Ob2PesoImage;
            default:
                return NormalPesoImage;
        }
    };

    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardHeader}>
                <div className={styles.titleContainer}>
                    <FaHeartbeat className={styles.StaticIcon} />
                    <h3 className={styles.sectionTitle}>Detalhes de Saúde</h3>
                </div>
                <Image src={EditImage} alt={"Editar"} className={styles.editIcon} onClick={openModal} priority />
            </div>
            <div className={styles.cardBody}>
                <div className={styles.profileCellRowIMC}>
                    <div className={styles.profileCellRowIMCLeft}>
                        <div className={styles.profileCellRowIMCLeftContent}>
                            <Image src={AlturaImage} alt="Altura" className={styles.StaticIconSaude}/>
                            <div className={styles.ImcTexts}>
                                <h3 className={styles.TitleImc}>Altura</h3>
                                <p className={styles.FontImc}>{cliente.saude?.altura || 'Não informada'} (M)</p>
                            </div>
                        </div>
                        <div className={styles.profileCellRowIMCLeftContent}>
                            <Image src={BalancaImage} alt="Peso" className={styles.StaticIconSaude}/>
                            <div className={styles.ImcTexts}>
                                <h3 className={styles.TitleImc}>Peso</h3>
                                <p className={styles.FontImc}>{cliente.saude?.peso || 'Não informado'} Kg</p>
                            </div>
                        </div>
                        <div className={styles.profileCellRowIMCLeftContent}>
                            {cliente.saude?.imc ? (
                                <Image src={imageImc(cliente.saude?.imc_grau || '')} alt={'IMC'} className={styles.StaticIconSaude} priority />
                            ) : ''}
                            <div className={styles.ImcTexts}>
                                <h3 className={styles.TitleImc}>IMC</h3>
                                <p className={styles.FontImc}>{cliente.saude?.imc ? cliente.saude.imc.toFixed(2) : 'Não calculado'}</p>
                                <h4 className={`${styles.FontImc} ${getImcGrauClass(cliente.saude?.imc_grau)}`}>
                                    {cliente.saude?.imc_grau || 'Não calculado'}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doença Preexistente */}
                <div className={styles.profileCellRowDoenca}>
                    <div className={styles.titleWithIcon}>
                        <h4>Doença Preexistente</h4>
                        {cliente.saude?.doenca_preexistente && (
                            <Image
                                src={CopyIcon}
                                alt="Copiar"
                                className={styles.copyIcon}
                                onClick={() => copyToClipboard(cliente.saude?.doenca_preexistente || '')}
                                priority
                            />
                        )}
                    </div>
                    <div className={styles.infoCard}>
                    <p className={styles.infoCard}>{cliente.saude?.doenca_preexistente || 'Nenhuma'}</p>

                    </div>
                </div>

                {/* Histórico Familiar de Doenças */}
                <div className={styles.profileCellRowDoenca}>
                    <div className={styles.titleWithIcon}>
                        <h4>Histórico Familiar de Doenças</h4>
                        {cliente.saude?.historico_familiar_doencas && (
                            <Image
                                src={CopyIcon}
                                alt="Copiar"
                                className={styles.copyIcon}
                                onClick={() => copyToClipboard(cliente.saude?.historico_familiar_doencas || '')}
                                priority
                            />
                        )}
                    </div>
                    <p className={styles.infoCard}>{cliente.saude?.historico_familiar_doencas || 'Nenhum'}</p>
                </div>
            </div>
            <EditHealthModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                initialData={{
                    altura: cliente.saude?.altura?.toString().replace('.', ',') || '',
                    peso: cliente.saude?.peso?.toString().replace('.', ',') || '',
                    doenca_preexistente: cliente.saude?.doenca_preexistente || '',
                    historico_familiar_doencas: cliente.saude?.historico_familiar_doencas || '',
                }}
                onSave={handleSave}
            />
        </div>
    );
};

export default HealthInfoCard;
