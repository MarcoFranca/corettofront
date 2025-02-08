import React, { useState } from 'react';
import { Cliente } from '@/types/interfaces';
import { useAppSelector } from '@/hooks/hooks';
import Image from "next/image";
import EditDocumentsModal from "./EditDocumentsModal";
import { RootState } from "@/store";

// Importando os estilos do `styled-components`
import {
    DocumentContainer,
    DocumentHeader,
    DocumentTitle,
    DocumentIconButton,
    EmptyMessage
} from "./DocumentInfoCard.styles";

// Importando imagens
import DocumentosImage from "../../../../../../../../../public/assets/pages/profile/Documentos.svg";
import EditImage from "../../../../../../../../../public/assets/common/edit.svg";
import {getCpfMask, getIdentityMask} from "@/utils/maskUtils";
import InputMask from "react-input-mask";
import {
    DetailsContainer
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(documents)/DocumentsFolder.styles";

interface DocumentInfoCardProps {
    cliente: Cliente;
}

const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const error = useAppSelector((state: RootState) => state.clientes.error);

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
                        <InputMask
                            mask={getCpfMask(cliente.cpf)}
                            value={cliente.cpf}
                            readOnly
                            className={"maskInput"}

                        />
                    ) : "Não informado"}</p>

                    <p>🆔 <strong>Identidade:</strong> {cliente.identidade ? (
                        <InputMask
                            mask={getIdentityMask(cliente.identidade)}
                            value={cliente.identidade}
                            readOnly
                            className={"maskInput"}

                        />
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
