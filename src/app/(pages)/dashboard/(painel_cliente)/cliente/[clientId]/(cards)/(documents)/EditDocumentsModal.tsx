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

interface EditDocumentsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    cliente: Cliente;
}

const EditDocumentsModal: React.FC<EditDocumentsModalProps> =
    ({
         isOpen,
         onRequestClose,
         cliente,
     }) => {
        const dispatch = useAppDispatch();

        const methods = useForm({
            defaultValues: {
                cpf: "",
                identidade: "",
            },
        });

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

        const onSubmit = async (data: any) => {
            if (!data.cpf && !data.identidade) {
                toast.error("⚠️ Preencha pelo menos um dos campos.");
                return;
            }

            const payload = {
                cpf: removeMask(data.cpf), // 🔥 Enviamos o CPF sem máscara
                identidade: removeMask(data.identidade), // 🔥 Enviamos a Identidade sem máscara
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
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <FloatingMaskedInput
                            name="identidade"
                            label="Identidade"
                            type="text"
                            control={control}
                            setValue={setValue}
                            register={register} // ✅ Agora passamos `register`
                            placeholder="Digite a Identidade"
                            mask={getIdentityMask(methods.watch("identidade"))} // ✅ Calcula máscara dinamicamente
                            required
                        />
                    </FormGroup>
                </ModalContainer>
            </StandardModal>
        );
    };

export default EditDocumentsModal;
