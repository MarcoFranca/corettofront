import React, { useState } from "react";
import EditClientModal from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/EditClientModal";
import { Cliente, ContatoAdicional } from "@/types/interfaces";
import { useAppDispatch } from "@/services/hooks/hooks";
import { updateCliente } from "@/store/slices/clientesSlice";
import Image from "next/image";
import Link from "next/link";
import {
    ContactContainer,
    ContactHeader,
    ContactTitle,
    ContactIcon,
    ContactRow,
    EmptyMessage,
    AdditionalContactsWrapper,
    ContactLabel, ContactContain, TippyContainer, TippyText
} from "./ContatoInfoCard.styles";
import EmailImage from "../../../../../../../../../public/assets/common/mail.svg";
import TellImage from "../../../../../../../../../public/assets/common/whats.svg";
import ContatoImage from "../../../../../../../../../public/assets/pages/profile/Contato.svg";
import EditImage from "../../../../../../../../../public/assets/common/edit.svg";
import styles from "@/app/(pages)/dashboard/(painel_admin)/lead/leadBoard/LeadBoard.module.css";
import { getPhoneMask, removeMask } from "@/utils/maskUtils";
import Tippy from "@tippyjs/react";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { useModalSoundEffect } from "@/services/hooks/useModalSoundEffect";
import { IMaskInput } from "react-imask";

interface ContactInfoCardProps {
    cliente: Cliente;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    // Apenas um uso do hook!
    useModalSoundEffect(modalIsOpen);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleSave = (data: any) => {
        dispatch(updateCliente({ id: cliente.id, updatedCliente: data }));
        closeModal();
    };

    // Função utilitária para deixar o telefone só números no href do WhatsApp
    const phoneHref = (phone: string) => {
        const num = removeMask(phone);
        return num ? `https://wa.me/55${num}` : "#";
    };

    return (
        <ContactContainer>
            <ContactHeader>
                <ContactTitle>
                    <Image src={ContatoImage} alt={"Contato"} width={24} height={24} />
                    <h3>Contato</h3>
                </ContactTitle>
                <Tippy
                    content={
                        <TippyContainer>
                            <TippyText>
                                <FaEdit size={18} color={'white'}/>
                                <h3>Editar Contato</h3>
                            </TippyText>
                            <p>ou</p>
                            <TippyText>
                                <FaPlusCircle size={18} color={'white'}/>
                                <h3>Acrescentar contato adicional</h3>
                            </TippyText>
                        </TippyContainer>
                    }
                    placement="top"
                    theme="custom"
                    animation="shift-away"
                    arrow={true}
                    maxWidth={500}
                    delay={[1500,0]}
                >
                    <ContactIcon src={EditImage.src} alt="Editar" onClick={openModal} />
                </Tippy>
            </ContactHeader>

            <ContactContain>

                {/* 🔹 E-mail */}
                <Link href={`mailto:${cliente.email}`} passHref>
                    <ContactRow>
                        <Image src={EmailImage} alt="E-mail" width={28} height={28} />
                        <p>{cliente.email || "Não informado"}</p>
                    </ContactRow>
                </Link>

                {/* 🔹 Telefone Principal */}
                <Link href={phoneHref(cliente.telefone)} passHref>
                    <ContactRow>
                        <Image src={TellImage} alt="WhatsApp" width={28} height={28} />
                        <p>
                            {cliente.telefone ? (
                                <IMaskInput
                                    mask={getPhoneMask(cliente.telefone)}
                                    value={cliente.telefone}
                                    readOnly
                                    className={styles.phoneInput}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        padding: 0,
                                        fontWeight: 500,
                                        color: "#333",
                                        width: "100%",
                                    }}
                                />
                            ) : "Não informado"}
                        </p>
                    </ContactRow>
                </Link>

                {/* 🔹 Contatos Adicionais */}
                {cliente.relacionamentos?.contatos_adicionais && cliente.relacionamentos.contatos_adicionais.length > 0 ? (
                    <AdditionalContactsWrapper>
                        <ContactLabel>Contatos Adicionais</ContactLabel>
                        {cliente.relacionamentos.contatos_adicionais.map(
                            (contato: ContatoAdicional, index: number) => (
                                <Link href={phoneHref(contato.valor)} passHref key={contato.valor || index}>
                                    <ContactRow>
                                        <Image src={TellImage} alt="WhatsApp" width={28} height={28} />
                                        <p>
                                            {contato.valor ? (
                                                <IMaskInput
                                                    mask={getPhoneMask(contato.valor)}
                                                    value={contato.valor}
                                                    readOnly
                                                    className={styles.phoneInput}
                                                    style={{
                                                        border: "none",
                                                        background: "transparent",
                                                        padding: 0,
                                                        fontWeight: 500,
                                                        color: "#333",
                                                        width: "100%",
                                                    }}
                                                />
                                            ) : "Não informado"}
                                        </p>
                                    </ContactRow>
                                </Link>
                            )
                        )}
                    </AdditionalContactsWrapper>
                ) : (
                    <EmptyMessage>Nenhum contato adicional cadastrado.</EmptyMessage>
                )}

                {/* 🔹 Modal de Edição */}
                <EditClientModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    initialData={{
                        email: cliente.email,
                        telefone: cliente.telefone,
                        contatos_adicionais: cliente.relacionamentos?.contatos_adicionais || [],
                    }}
                    onSave={handleSave}
                />
            </ContactContain>
        </ContactContainer>
    );
};

export default ContactInfoCard;
