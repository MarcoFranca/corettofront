import React from 'react';
import ReactModal from 'react-modal';
import {
    ModalActions, ModalButton,
    ModalContent,
    ModalHeader,
    ModalMessage,
    ModalOverlay
} from './ConfirmDeleteModal.styles'; // Importe seus estilos

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
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="Overlay" // Custom overlay styling
            className="Modal" // Custom modal styling
            ariaHideApp={false} // Disable this if you don't set up appElement for accessibility
        >
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalMessage>{message}</ModalMessage>
                    <ModalActions>
                        <ModalButton className="cancel" onClick={onRequestClose}>Cancelar</ModalButton>
                        <ModalButton className="confirm" onClick={onConfirm}>Confirmar</ModalButton>
                    </ModalActions>
                </ModalContent>
            </ModalOverlay>
        </ReactModal>
    );
};

export default ConfirmationModal;
