import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { toast } from "react-toastify";
import { ContatoAdicional, EditClientModalProps } from "@/types/interfaces";
import { removeMask } from "@/utils/maskUtils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Index from "@/app/components/ui/Button";
import {
    InputGroup,
    ContactRow,
    RemoveButton,
    EmptyMessage,
    ContactSelect,
    PhoneInput,
} from "./EditClientModal.Styles";

const EditClientModal: React.FC<EditClientModalProps> =
    ({
         isOpen,
         onRequestClose,
         initialData,
         onSave }) => {

    // ✅ Conectando o formulário corretamente ao `react-hook-form`
    const methods = useForm({
        mode: "onChange",
        defaultValues: initialData || {}, // ✅ Agora aceita qualquer campo dinamicamente
    });

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        control,
        formState: { isValid, isSubmitting }
    } = methods;


    // ✅ Resetando os valores quando `initialData` mudar
    useEffect(() => {
        if (initialData) {
            reset({
                email: initialData.email || "",
                telefone: initialData.telefone || "",
            });
            setTimeout(() => {
                methods.trigger(); // ✅ Isso força o React Hook Form a revalidar os campos!
            }, 100);
        }
    }, [initialData, reset, methods]);


    // ✅ Estado para os contatos adicionais
    const [contatosAdicionais, setContatosAdicionais] = useState<ContatoAdicional[]>(initialData?.contatos_adicionais || []);

    const handleAddContato = () => {
        setContatosAdicionais([...contatosAdicionais, { id: "", tipo: "Outro", valor: "" }]);
    };

    const handleRemoveContato = (index: number) => {
        setContatosAdicionais(contatosAdicionais.filter((_, i) => i !== index));
    };

    const handleContatoChange = (index: number, valor: string) => {
        const cleanedValue = removeMask(valor);
        const updatedContatos = [...contatosAdicionais];
        updatedContatos[index] = { ...updatedContatos[index], valor: cleanedValue };
        setContatosAdicionais(updatedContatos);
    };

    const handleTipoChange = (index: number, tipo: string) => {
        const updatedContatos = [...contatosAdicionais];
        updatedContatos[index] = { ...updatedContatos[index], tipo };
        setContatosAdicionais(updatedContatos);
    };

    // ✅ Agora o formulário está corretamente conectado ao `react-hook-form`
    const handleSubmitForm = async (data: any) => {
        try {
            onSave({
                ...data,
                contatos_adicionais: contatosAdicionais.map(contato => ({
                    id: contato.id || undefined,
                    tipo: contato.tipo || "outro",
                    valor: contato.valor,
                })),
            });

            toast.success("✅ Alterações salvas com sucesso!");
            onRequestClose();
        } catch (error) {
            toast.error("❌ Erro ao salvar alterações. Tente novamente.");
        }
    };

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Editar Cliente"
            onSubmit={handleSubmit(handleSubmitForm)}
            buttonText="Salvar Cliente"
            buttonIcon={<IoPerson />}
            successMessage="Cliente atualizado com sucesso!"
            errorMessage="Erro ao atualizar cliente, tente novamente."
            methods={methods}
            textLoading={"Atualizando... "}
        >
            <InputGroup>
                <FloatingMaskedInput
                    label="E-mail"
                    name="email"
                    type="email"
                    required
                    register={register}
                    setValue={setValue} // ✅ Passando `setValue` corretamente
                    control={control} // ✅ Agora `control` está correto
                />

            </InputGroup>

            <InputGroup>
                <FloatingMaskedInput
                    label="Telefone"
                    name="telefone"
                    type="text"
                    mask="(99) 99999-9999"
                    required
                    register={register}
                    setValue={setValue} // ✅ Agora `setValue` está correto
                    control={control} // ✅ Agora `control` está correto
                />

            </InputGroup>

            <h4>Contatos Adicionais</h4>
            {contatosAdicionais.length > 0 ? (
                contatosAdicionais.map((contato, index) => (
                    <ContactRow key={index}>
                        <ContactSelect>
                            <select
                                value={contato.tipo}
                                onChange={(e) => handleTipoChange(index, e.target.value)}
                            >
                                <option value="celular">Celular</option>
                                <option value="residencial">Residencial</option>
                                <option value="comercial">Comercial</option>
                                <option value="outro">Outro</option>
                            </select>
                            <PhoneInput
                                mask={contato.tipo !== "residencial" ? "(99) 99999-9999" : "(99) 9999-9999"}
                                value={contato.valor}
                                onChange={(e) => handleContatoChange(index, e.target.value)}
                                required
                            />
                            <RemoveButton
                                type="button"
                                onClick={() => handleRemoveContato(index)}
                            >
                                <FaTrash size={16} />
                            </RemoveButton>
                        </ContactSelect>
                    </ContactRow>
                ))
            ) : (
                <EmptyMessage>Nenhum contato adicional cadastrado.</EmptyMessage>
            )}
            <Index type="button" variant="warning" icon={<FaPlus />} iconPosition="left" onClick={handleAddContato}>
                Adicionar Contato
            </Index>
        </StandardModal>
    );
};

export default EditClientModal;
