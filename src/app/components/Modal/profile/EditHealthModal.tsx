import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import { useAppDispatch, useAppSelector } from "@/services/hooks/hooks";
import { updateClienteSaude } from "@/store/slices/clientesSlice";
import { RootState } from "@/store";
import {
    Input,
    Label,
    ModalContent,
    TextArea
} from "@/app/components/Modal/profile/EditHealthModal.styles";

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
            <ModalContent>
                <Label>
                    {formatLabel("altura")}:
                    <Input type="text" {...register("altura")} />
                </Label>
                <Label>
                    {formatLabel("peso")}:
                    <Input type="text" {...register("peso")} />
                </Label>
                <Label>
                    {formatLabel("doenca_preexistente")}:
                    <TextArea {...register("doenca_preexistente")} />
                </Label>
                <Label>
                    {formatLabel("historico_familiar_doencas")}:
                    <TextArea {...register("historico_familiar_doencas")} />
                </Label>
            </ModalContent>
        </StandardModal>
    );
};

export default EditHealthModal;
