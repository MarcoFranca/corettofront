import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { updateClienteSaude } from "@/store/slices/clientesSlice";
import styles from "./EditHealthModal.module.css";
import { RootState } from "@/store";

interface EditHealthModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: any;
    onSave: (data: any) => void;
}

const EditHealthModal: React.FC<EditHealthModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const dispatch = useAppDispatch();
    const clienteId = useAppSelector((state: RootState) => state.clientes.clienteDetalhe?.id);

    const methods = useForm({
        defaultValues: initialData,
        mode: "onChange",
    });

    const { register, handleSubmit, setValue } = methods;

    useEffect(() => {
        Object.keys(initialData).forEach((key) => setValue(key, initialData[key]));
    }, [initialData, setValue]);

    const handleSave = (data: any) => {
        if (clienteId) {
            const saudeData = {
                ...data,
                altura: parseFloat(data.altura.replace(",", ".")),
                peso: parseFloat(data.peso.replace(",", "."))
            };
            dispatch(updateClienteSaude({ id: clienteId, saudeData }));
            onSave(data);
        }
        onRequestClose();
    };

    const formatLabel = (label: string) => {
        return label.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Atualizar Dados de Saúde"
            onSubmit={handleSubmit(handleSave)}
            buttonText="Salvar"
            buttonIcon={null}
            successMessage="Dados de saúde atualizados com sucesso!"
            errorMessage="Erro ao atualizar dados de saúde, tente novamente."
            methods={methods} // ✅ Agora passamos um `useForm` completo
        >
            <div className={styles.modalContent}>
                <label>
                    {formatLabel("altura")}:
                    <input type="text" {...register("altura")} />
                </label>
                <label>
                    {formatLabel("peso")}:
                    <input type="text" {...register("peso")} />
                </label>
                <label>
                    {formatLabel("doenca_preexistente")}:
                    <textarea {...register("doenca_preexistente")} />
                </label>
                <label>
                    {formatLabel("historico_familiar_doencas")}:
                    <textarea {...register("historico_familiar_doencas")} />
                </label>
            </div>
        </StandardModal>
    );
};

export default EditHealthModal;
