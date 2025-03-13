import React from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import styles from "./ConfirmDeleteModal.module.css";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onRequestClose, onConfirm }) => {
    const methods = useForm({
        defaultValues: {},
        mode: "onChange"
    });

    const { handleSubmit } = methods;

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Confirmar Exclusão"
            onSubmit={handleSubmit(() => {
                onConfirm();
                onRequestClose();
            })}
            buttonText="Sim"
            buttonIcon={null}
            successMessage="Item excluído com sucesso!"
            errorMessage="Erro ao excluir item, tente novamente."
            methods={methods} // ✅ Agora passamos um `useForm` válido
        >
            <p className={styles.modalText}>Tem certeza que deseja deletar esta tarefa?</p>
        </StandardModal>
    );
};

export default ConfirmDeleteModal;
