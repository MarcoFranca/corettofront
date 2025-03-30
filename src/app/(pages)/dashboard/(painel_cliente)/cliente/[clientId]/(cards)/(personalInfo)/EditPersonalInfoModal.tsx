import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import SelectProfissao from "@/app/components/ui/select/SelectProfissao/SelectProfissao";
import api from "@/app/api/axios";
import { EditPersonalInfoModalProps, genderOptions, Profissao } from "@/types/interfaces";
import { ModalContainer, FormGroup } from "./EditPersonalInfoModal.styles";
import {AiOutlineSave} from "react-icons/ai";
import {showToastWithSound} from "@/services/hooks/useToastMessageWithSound";

/**
 * Formata a data para o formato esperado pelo input (`yyyy-MM-dd`).
 */
const formatDateToInput = (date: string): string => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}`;
};

const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const methods = useForm({
        defaultValues: {
            data_nascimento: "",
            genero: "",
            profissao_id: "",
        },
    });

    const { control, register ,  handleSubmit, setValue, reset } = methods;
    const [profissoes, setProfissoes] = useState<{ label: string; options: { value: string; label: string }[] }[]>([]);

    // Preenche os valores iniciais do formulário quando o modal é aberto
    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                data_nascimento: initialData.data_nascimento
                    ? formatDateToInput(initialData.data_nascimento)
                    : "",
                genero: initialData.genero || "",
                profissao_id: initialData.profissao?.id || "",
            });
        }
    }, [isOpen, initialData, reset]);

    // Carrega as profissões ao abrir o modal
    useEffect(() => {
        const fetchProfissoes = async () => {
            try {
                const response = await api.get("/profissoes/");
                const dadosProfissoes = response.data;

                const organizadas = dadosProfissoes.map((profissao: Profissao) => ({
                    label: profissao.nome,
                    options: [
                        { value: profissao.id, label: `🔹 ${profissao.nome}` },
                        ...(profissao.subcategorias ?? []).map((sub: Profissao) => ({
                            value: sub.id,
                            label: `↳ ${sub.nome}`,
                        })),
                    ],
                }));

                setProfissoes(organizadas);
            } catch (error) {
                showToastWithSound({ type: "error", message: "❌ Erro ao carregar profissões!" });
                console.error("Erro ao buscar profissões:", error);
            }
        };

        if (isOpen) {
            fetchProfissoes();
        }
    }, [isOpen]);

    const onSubmit = (data: any) => {
        if (!data.data_nascimento || !data.genero || !data.profissao_id) {
            showToastWithSound({ type: "error", message: "⚠️ Preencha todos os campos obrigatórios." });
            return;
        }

        onSave({
            data_nascimento: data.data_nascimento,
            genero: data.genero,
            profissao_id: data.profissao_id,
        });

        onRequestClose();
    };

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Editar Dados Pessoais"
            onSubmit={methods.handleSubmit(onSubmit)}
            buttonIcon={
                    <AiOutlineSave/>
            }
            methods={methods}
        >
            <ModalContainer>
                <FormGroup>
                    <FloatingMaskedInput
                        register={register}
                        setValue={setValue}
                        control={control}
                        name="data_nascimento"
                        label="Data de Nascimento"
                        type="date"
                        value={initialData.data_nascimento} // Adicione isso para garantir que o valor inicial seja passado
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <SelectCustom
                        name="genero"
                        control={control}
                        label="Gênero"
                        showLabel={false}
                        placeholder="Selecione um gênero"
                        options={genderOptions}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <SelectProfissao
                        name="profissao_id"
                        control={control}
                        placeholder="Selecione a profissão"
                        showLabel={false}
                        required
                    />
                </FormGroup>
            </ModalContainer>
        </StandardModal>
    );
};

export default EditPersonalInfoModal;
