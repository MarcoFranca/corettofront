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
    ContactLabel, ContactContain
} from "./ContatoInfoCard.styles";

// Importando imagens
import EmailImage from "../../../../../../../../../public/assets/common/mail.svg";
import TellImage from "../../../../../../../../../public/assets/common/whats.svg";
import ContatoImage from "../../../../../../../../../public/assets/pages/profile/Contato.svg";
import EditImage from "../../../../../../../../../public/assets/common/edit.svg";
import styles from "@/app/components/leadBoard/LeadBoard.module.css";
import InputMask from "react-input-mask";

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
                <ContactIcon src={EditImage.src} alt="Editar" onClick={openModal} />
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
                            mask="(99) 99999-9999"
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
                                            mask="(99) 99999-9999"
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

                {/*/!* 🔹 Botão para Adicionar Contato *!/*/}
                {/*<AddContactButton onClick={openModal}>*/}
                {/*    <Image src={AddImage} alt="Adicionar" width={24} height={24} />*/}
                {/*    Adicionar Contato*/}
                {/*</AddContactButton>*/}

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
