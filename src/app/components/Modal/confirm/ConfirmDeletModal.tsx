import React from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import {
    ModalActions, ModalButton,
    ModalContent,
    ModalHeader,
    ModalMessage,
    ModalOverlay
} from "./ConfirmDeleteModal.styles"; // Importe seus estilos

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmDeleteModalProps> = ({
                                                                  isOpen,
                                                                  onRequestClose,
                                                                  onConfirm,
                                                                  title,
                                                                  message,
                                                              }) => {
    const methods = useForm();

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={title}
            onSubmit={methods.handleSubmit(() => {
                onConfirm();
                onRequestClose();
            })}
            buttonText="Confirmar"
            buttonIcon={null}
            successMessage="Ação confirmada com sucesso!"
            errorMessage="Erro ao confirmar a ação, tente novamente."
            methods={methods} // ✅ Passando um `useForm` válido
        >
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalMessage>{message}</ModalMessage>
                    <ModalActions>
                        <ModalButton className="cancel" type="button" onClick={onRequestClose}>
                            Cancelar
                        </ModalButton>
                        <ModalButton className="confirm" type="submit">
                            Confirmar
                        </ModalButton>
                    </ModalActions>
                </ModalContent>
            </ModalOverlay>
        </StandardModal>
    );
};

export default ConfirmationModal;
