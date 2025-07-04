import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { playSound } from "@/store/slices/soundSlice";
import { useAppDispatch } from "@/services/hooks/hooks";
import { ContatoAdicional, EditClientModalProps } from "@/types/interfaces";
import { removeMask } from "@/utils/maskUtils";
import {FaBuilding, FaMobileAlt, FaPhoneAlt, FaPlus, FaQuestion, FaTrash} from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Index from "@/app/components/ui/Button";
import {
    InputGroup,
    ContactRow,
    RemoveButton,
    EmptyMessage,
    ContactSelect,
    TipoContainer, TipoButton,
} from "./EditClientModal.Styles";
import {showToastWithSound} from "@/services/hooks/useToastMessageWithSound";
import PhoneInputBase from "@/app/components/ui/input/PhoneInputBase";
import PhoneInput from "@/app/components/ui/input/PhoneInput";

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
        const dispatch = useAppDispatch();


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

        const TIPO_ICONS = {
            celular: <FaMobileAlt />,
            residencial: <FaPhoneAlt />,
            comercial: <FaBuilding />,
            outro: <FaQuestion />,
        };

        const TIPO_LABELS = {
            celular: "Celular",
            residencial: "Residencial",
            comercial: "Comercial",
            outro: "Outro",
        };


        const handleAddContato = () => {
            setContatosAdicionais([...contatosAdicionais, { id: "", tipo: "Outro", valor: "" }]);
            dispatch(playSound("add")); // ou outro som como "addItem"
        };

        const handleRemoveContato = (index: number) => {
            setContatosAdicionais(contatosAdicionais.filter((_, i) => i !== index));
            dispatch(playSound("delete2")); // ou "delete"
        };


        const handleContatoChange = (index: number, e: any) => {
            const cleanedValue = removeMask(e.target.value);
            const updatedContatos = [...contatosAdicionais];
            updatedContatos[index] = { ...updatedContatos[index], valor: cleanedValue };
            const hasDuplicated = contatosAdicionais.some((contato, index, self) =>
                self.findIndex(c => c.valor === contato.valor) !== index
            );

            if (hasDuplicated) {
                showToastWithSound({ type: "error", message: "⚠️ Existem contatos duplicados." });
                return;
            }
            setContatosAdicionais(updatedContatos);
        };




        const handleTipoChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedContatos = [...contatosAdicionais];
    updatedContatos[index] = { ...updatedContatos[index], tipo: e.target.value };
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

            showToastWithSound({ type: "success", message: "✅ Alterações salvas com sucesso!" });
            onRequestClose();
        } catch (error) {
            showToastWithSound({ type: "error", message: "❌ Erro ao salvar alterações. Tente novamente." });
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
                <PhoneInput
                    label="Telefone"
                    name="telefone"
                    control={control}
                    setValue={setValue}
                    required
                />
            </InputGroup>

            <h4>Contatos Adicionais</h4>
            {contatosAdicionais.length > 0 ? (
                contatosAdicionais.map((contato, index) => (
                    <ContactRow key={index}>
                        <ContactSelect>
                            <TipoContainer>
                                {Object.entries(TIPO_LABELS).map(([key, label]) => (
                                    <TipoButton
                                        key={key}
                                        type="button"
                                        className={contato.tipo === key ? "selected" : ""}
                                        onClick={() =>
                                            handleTipoChange(index, { target: { value: key } } as React.ChangeEvent<HTMLSelectElement>)
                                        }
                                    >
                                        {TIPO_ICONS[key as keyof typeof TIPO_ICONS]}
                                        <span>{label}</span>
                                    </TipoButton>
                                ))}
                            </TipoContainer>
                            <PhoneInputBase
                                mask={contato.tipo !== "residencial" ? "(99) 99999-9999" : "(99) 9999-9999"}
                                value={contato.valor}
                                onChange={(e) => handleContatoChange(index, e)}
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
