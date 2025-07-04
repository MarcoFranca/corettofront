"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import SelectProfissao from "@/app/components/ui/select/SelectProfissao/SelectProfissao";
import { Cliente } from "@/types/interfaces";
import { useDispatch } from "react-redux";
import { updateCliente } from "@/store/slices/clientesSlice";
import {toastSuccess, toastError} from "@/utils/toastWithSound";
import {
    DrawerFormWrapper, NameContainer, ContatoContainer, SubmitButton, SelectDiv
} from "./CadastroLeadForm.styles";
import type { AppDispatch } from "@/store"; // já deve existir

interface EditLeadFormProps {
    cliente: Cliente;
    onSuccess?: () => void;
}

const EditLeadForm: React.FC<EditLeadFormProps> = ({ cliente, onSuccess }) => {
    const dispatch = useDispatch<AppDispatch>();
    const methods = useForm({
        mode: "onChange",
        defaultValues: {
            nome: cliente?.nome || "",
            sobre_nome: cliente?.sobre_nome || "",
            genero: cliente?.genero || "",
            telefone: cliente?.telefone || "",
            email: cliente?.email || "",
            profissao_id: cliente?.profissao_id || "",
        },
    });

    const { register, setValue, handleSubmit, control, formState: { errors, isSubmitting } } = methods;

    useEffect(() => {
        // Atualiza o form quando trocar o cliente selecionado
        if (cliente) {
            setValue("nome", cliente.nome || "");
            setValue("sobre_nome", cliente.sobre_nome || "");
            setValue("genero", cliente.genero || "");
            setValue("telefone", cliente.telefone || "");
            setValue("email", cliente.email || "");
            setValue("profissao_id", cliente.profissao_id || "");
        }
    }, [cliente, setValue]);

    const onSubmit = async (data: any) => {
        try {
            const updatedData = {
                ...data,
                telefone: data.telefone.replace(/\D/g, ""),
            };
            await dispatch(updateCliente({ id: cliente.id, updatedCliente: updatedData })).unwrap();
            toastSuccess("Lead atualizado com sucesso!");
            onSuccess && onSuccess();
        } catch (error) {
            toastError("Erro ao atualizar lead.");
        }
    };

    return (
        <DrawerFormWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
                <NameContainer>
                    <FloatingMaskedInput
                        label="Primeiro Nome"
                        name="nome"
                        type="text"
                        register={register}
                        setValue={setValue}
                        control={control}
                        required
                        errorMessage={errors.nome?.message}
                    />
                    <FloatingMaskedInput
                        label="Sobre Nome"
                        name="sobre_nome"
                        type="text"
                        register={register}
                        setValue={setValue}
                        control={control}
                        errorMessage={errors.sobre_nome?.message}
                    />
                </NameContainer>
                <ContatoContainer>
                    <FloatingMaskedInput
                        label="Telefone"
                        name="telefone"
                        type="text"
                        mask="(99) 99999-9999"
                        register={register}
                        setValue={setValue}
                        control={control}
                        errorMessage={errors.telefone?.message}
                        required
                    />
                    <FloatingMaskedInput
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        setValue={setValue}
                        control={control}
                        errorMessage={errors.email?.message}
                    />
                </ContatoContainer>
                <SelectDiv>

                    <SelectCustom
                        name="genero"
                        control={control}
                        label="Gênero"
                        showLabel={false}
                        placeholder="Selecione um gênero"
                        options={[
                            { value: "M", label: "Masculino" },
                            { value: "F", label: "Feminino" },
                        ]}
                        required
                        errorMessage={errors.genero?.message}
                    />
                    <SelectProfissao
                        name="profissao_id"
                        control={control}
                        placeholder="Selecione a profissão"
                        showLabel={false}
                        errorMessage={errors.profissao_id?.message}
                    />
                </SelectDiv>
                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </SubmitButton>
            </form>
        </DrawerFormWrapper>
    );
};

export default EditLeadForm;
