import React, { useState } from 'react';
import { Cliente } from '@/types/interfaces';
import { useAppSelector } from '@/services/hooks/hooks';
import Image from "next/image";
import EditDocumentsModal from "./EditDocumentsModal";
import { RootState } from "@/store";
import { IMaskInput } from "react-imask";
import {
    DocumentContainer,
    DocumentHeader,
    DocumentTitle,
    DocumentIconButton,
    EmptyMessage
} from "./DocumentInfoCard.styles";
import DocumentosImage from "../../../../../../../../../public/assets/pages/profile/Documentos.svg";
import EditImage from "../../../../../../../../../public/assets/common/edit.svg";
import {getCpfMask, getIdentityMask} from "@/utils/maskUtils";
import {
    DetailsContainer
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(documents)/DocumentsFolder.styles";
import {useModalSoundEffect} from "@/services/hooks/useModalSoundEffect";

// (Opcional) Para manter estilos:
import styled from "styled-components";
const MaskInput = styled(IMaskInput)`
    border: none;
    background: transparent;
    font-size: 1rem;
    color: #222;
    padding: 0;
    width: auto;
`;

interface DocumentInfoCardProps {
    cliente: Cliente;
}

const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const error = useAppSelector((state: RootState) => state.clientes.error);
    useModalSoundEffect(modalIsOpen);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <DocumentContainer>
            {/* 🔹 Cabeçalho do Card */}
            <DocumentHeader>
                <DocumentTitle>
                    <Image src={DocumentosImage} alt={"Documentos"} width={24} height={24} />
                    <h3>Documentos</h3>
                </DocumentTitle>
                <DocumentIconButton onClick={openModal}>
                    <Image src={EditImage} alt="Editar" width={20} height={20} />
                </DocumentIconButton>
            </DocumentHeader>

            {error && <p className="error-message">{error}</p>}

            {/* 🔹 Informações de Documento */}
            {cliente.cpf || cliente.identidade ? (
                <DetailsContainer>
                    <p>📋 <strong>CPF:</strong> {cliente.cpf ? (
                        <MaskInput
                            mask={getCpfMask(cliente.cpf)}
                            value={cliente.cpf}
                            readOnly
                            className="maskInput"
                        />
                    ) : "Não informado"}</p>

                    <p>🆔 <strong>Identidade:</strong> {cliente.identidade ? (
                        <div>
                            <MaskInput
                                mask={getIdentityMask(cliente.tipo_identidade)}
                                value={cliente.identidade}
                                readOnly
                                className="maskInput"
                            />
                        </div>
                    ) : "Não informado"}</p>
                </DetailsContainer>
            ) : (
                <EmptyMessage>Nenhum documento cadastrado.</EmptyMessage>
            )}

            {/* 🔹 Modal de Edição */}
            <EditDocumentsModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                cliente={cliente}
            />
        </DocumentContainer>
    );
};

export default DocumentInfoCard;
