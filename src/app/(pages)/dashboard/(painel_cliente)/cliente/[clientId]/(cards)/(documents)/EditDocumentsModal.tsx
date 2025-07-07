import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { toast } from "react-toastify";
import { Cliente } from "@/types/interfaces";
import { useAppDispatch } from "@/services/hooks/hooks";
import { updateCliente } from "@/store/slices/clientesSlice";
import { ModalContainer, FormGroup } from "./EditDocumentsModal.styles";
import IdentidadeInput from "@/app/components/ui/input/IdInput";
import CPFInput from "@/app/components/ui/input/CpfInput";
import { removeMask } from "@/utils/maskUtils";

interface EditDocumentsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    cliente: Cliente;
}

const EditDocumentsModal: React.FC<EditDocumentsModalProps> = ({
                                                                   isOpen,
                                                                   onRequestClose,
                                                                   cliente,
                                                               }) => {
    const dispatch = useAppDispatch();
    const methods = useForm({
        defaultValues: {
            cpf: "",
            identidade: "",
            tipo_identidade: "",
            data_nascimento: "",
            nome_mae: "",
        },
    });

    const { control, handleSubmit, setValue, register, reset, watch } = methods;

    useEffect(() => {
        if (isOpen && cliente) {
            reset({
                cpf: cliente.cpf || "",
                identidade: cliente.identidade || "",
                tipo_identidade: cliente.tipo_identidade || "RG",
                data_nascimento: cliente.data_nascimento || "",
                nome_mae: cliente.nome_mae || "",
            });
        }
    }, [isOpen, cliente, reset]);

    // NÃO zere identidade se só está abrindo, só zere se trocar tipo_identidade no Select do IdInput!

    // Helper seguro para enviar só campos preenchidos e obrigatórios
    const buildSafePayload = (data: any, cliente: Cliente) => {
        const payload: any = {
            nome: cliente.nome,
            genero: cliente.genero,
            telefone: cliente.telefone,
        };
        if (removeMask(data.cpf)) payload.cpf = removeMask(data.cpf);
        if (removeMask(data.identidade)) {
            payload.identidade = removeMask(data.identidade);
            payload.tipo_identidade = data.tipo_identidade;
        }
        if (data.data_nascimento) payload.data_nascimento = data.data_nascimento;
        if (data.nome_mae) payload.nome_mae = data.nome_mae;
        return payload;
    };

    const onSubmit = async (data: any) => {
        const payload = buildSafePayload(data, cliente);
        try {
            await dispatch(updateCliente({ id: cliente.id, updatedCliente: payload })).unwrap();
            toast.success("📜 Dados salvos com sucesso!");
            onRequestClose();
        } catch (error) {
            toast.error("❌ Erro ao atualizar. Tente novamente.");
        }
    };

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Editar Documentos"
            onSubmit={handleSubmit(onSubmit)}
            buttonText="Salvar"
            methods={methods}
        >
            <ModalContainer>
                <FormGroup>
                    <CPFInput
                        name="cpf"
                        control={control}
                        setValue={setValue}
                        required={false}
                    />
                </FormGroup>
                <FormGroup>
                    <IdentidadeInput
                        name="identidade"
                        control={control}
                        setValue={setValue}
                        required={false}
                    />
                </FormGroup>
                <FormGroup>
                    <FloatingMaskedInput
                        name="data_nascimento"
                        label="Data de Nascimento"
                        type="date"
                        control={control}
                        setValue={setValue}
                        register={register}
                        placeholder="DD/MM/AAAA"
                    />
                </FormGroup>
                <FormGroup>
                    <FloatingMaskedInput
                        name="nome_mae"
                        label="Nome da Mãe"
                        type="text"
                        control={control}
                        setValue={setValue}
                        register={register}
                        placeholder="Digite o nome completo"
                    />
                </FormGroup>
            </ModalContainer>
        </StandardModal>
    );
};

export default EditDocumentsModal;
