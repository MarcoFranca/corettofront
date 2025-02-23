import React, { useState } from "react";
import EditClientModal from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/EditClientModal";
import { Cliente, ContatoAdicional } from "@/types/interfaces";
import { useAppDispatch } from "@/hooks/hooks";
import { updateCliente } from "@/store/slices/clientesSlice";
import Image from "next/image";
import Link from "next/link";

// Importando os estilos do `styled-components`
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

// Importando imagens
import EmailImage from "../../../../../../../../../public/assets/common/mail.svg";
import TellImage from "../../../../../../../../../public/assets/common/whats.svg";
import ContatoImage from "../../../../../../../../../public/assets/pages/profile/Contato.svg";
import EditImage from "../../../../../../../../../public/assets/common/edit.svg";
import styles from "@/app/(pages)/dashboard/(painel_admin)/lead/leadBoard/LeadBoard.module.css";
import InputMask from "react-input-mask-next";
import {getPhoneMask} from "@/utils/maskUtils";
import Tippy from "@tippyjs/react";
import {
    FaEdit,
    FaPlusCircle
} from "react-icons/fa";

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

    return (
        <ContactContainer>
            {/* 🔹 Cabeçalho do Card */}
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
                    delay={[1500,0]} // Atraso para exibir e esconder [show, hide]
                    // appendTo="parent" // Resolve o problema de corte
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
                <Link href={`https://wa.me/+55${cliente.telefone}`} passHref>
                    <ContactRow>
                        <Image src={TellImage} alt="WhatsApp" width={28} height={28} />
                        <p>{cliente.telefone ? <InputMask
                            mask={getPhoneMask(cliente.telefone)}
                            value={cliente.telefone}
                            readOnly
                            className={styles.phoneInput} // Estilo personalizado
                        />: "Não informado"}</p>
                    </ContactRow>
                </Link>

                {/* 🔹 Contatos Adicionais */}
                {cliente.relacionamentos?.contatos_adicionais &&
                cliente.relacionamentos.contatos_adicionais.length > 0 ? (
                    <AdditionalContactsWrapper>
                        <ContactLabel>Contatos Adicionais</ContactLabel>
                        {cliente.relacionamentos.contatos_adicionais.map(
                            (contato: ContatoAdicional, index: number) => (
                                <Link href={`https://wa.me/+55${contato.valor}`} passHref>
                                    <ContactRow>
                                        <Image src={TellImage} alt="WhatsApp" width={28} height={28} />
                                        <p>{cliente.telefone ? <InputMask
                                            mask={getPhoneMask(contato.valor)}
                                            value={contato.valor}
                                            readOnly
                                            className={styles.phoneInput} // Estilo personalizado
                                        />: "Não informado"}</p>
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
