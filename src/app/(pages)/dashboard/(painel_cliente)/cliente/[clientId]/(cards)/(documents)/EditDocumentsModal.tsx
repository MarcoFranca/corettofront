import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { toast } from "react-toastify";
import { Cliente } from "@/types/interfaces";
import { useAppDispatch } from "@/services/hooks/hooks";
import { updateCliente } from "@/store/slices/clientesSlice";
import { ModalContainer, FormGroup } from "./EditDocumentsModal.styles";
import { removeMask, getCpfMask, getIdentityMask } from "@/utils/maskUtils";
import {useModalSound} from "@/services/hooks/useModalSound";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import {identidadeOptions} from "@/utils/statusOptions";
import {getIdentityPlaceholder} from "@/utils/functions";

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
            tipo_identidade: "RG",
        },
    });

    useModalSound(isOpen); // 👈 Toca som ao abrir/fechar


    const {
        control,
        handleSubmit,
        setValue,
        register,
        reset
    } = methods;

    // Preenche os valores iniciais do formulário quando o modal é aberto
    useEffect(() => {
        if (isOpen && cliente) {
            reset({
                cpf: cliente.cpf || "",
                identidade: cliente.identidade || "",
            });
        }
    }, [isOpen, cliente, reset]);

    useEffect(() => {
        // Quando o tipo de identidade mudar, limpa o valor da identidade
        setValue("identidade", "");
    }, [methods.watch("tipo_identidade")]);


    const onSubmit = async (data: any) => {
        if (!data.cpf && !data.identidade) {
            toast.error("⚠️ Preencha pelo menos um dos campos.");
            return;
        }

        const payload = {
            cpf: removeMask(data.cpf), // 🔥 Enviamos o CPF sem máscara
            identidade: removeMask(data.identidade), // 🔥 Enviamos a Identidade sem máscara
            tipo_identidade: data.tipo_identidade
        };

        try {
            await dispatch(updateCliente({ id: cliente.id, updatedCliente: payload })).unwrap();
            toast.success("📜 Documentos atualizados com sucesso!");
            onRequestClose();
        } catch (error) {
            console.error("Erro ao atualizar documentos:", error);
            toast.error("❌ Erro ao atualizar documentos. Tente novamente.");
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
                    <FloatingMaskedInput
                        name="cpf"
                        label="CPF"
                        type="text"
                        control={control}
                        setValue={setValue}
                        register={register} // ✅ Agora passamos `register`
                        placeholder="Digite o CPF"
                        mask={getCpfMask(methods.watch("cpf"))} // ✅ Calcula máscara dinamicamente
                    />
                </FormGroup>

                <FormGroup>
                    <SelectCustom
                        name="tipo_identidade"
                        isMulti={false}
                        control={control}
                        label="Tipo de Documento"
                        options={identidadeOptions}
                        placeholder={getIdentityPlaceholder(methods.watch("tipo_identidade"))}
                        onChange={(value) => {
                            if (typeof value === "string") {
                                setValue("tipo_identidade", value);
                            }
                        }}
                    />
                    <FloatingMaskedInput
                        name="identidade"
                        label="Identidade"
                        type="text"
                        control={control}
                        setValue={setValue}
                        register={register}
                        mask={getIdentityMask(methods.watch("tipo_identidade"))}

                        onChange={(value) => {
                            if (typeof value === "string") {
                                setValue("tipo_identidade", value);
                                setValue("identidade", ""); // limpa o campo se o tipo mudar
                            }
                        }}
                    />
                </FormGroup>
            </ModalContainer>
        </StandardModal>
    );
};

export default EditDocumentsModal;
