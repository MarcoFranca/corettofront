import React from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import styles from "./TaskModal.module.css";

interface TaskModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onRequestClose, children }) => {
    const methods = useForm({ defaultValues: {}, mode: "onChange" });

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Tarefa"
            onSubmit={methods.handleSubmit(() => onRequestClose())}
            buttonText="Fechar"
            buttonIcon={null}
            methods={methods} // ✅ Passando `useForm` válido
        >
            <div className={styles.modalContent}>{children}</div>
        </StandardModal>
    );
};

export default TaskModal;
