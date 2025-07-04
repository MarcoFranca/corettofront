import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createCliente } from "@/store/slices/clientesSlice";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import Select from "react-select";
import { AppDispatch } from "@/store";
import { Cliente } from "@/types/interfaces";
import { useForm } from "react-hook-form";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import SelectProfissao from "@/app/components/ui/select/SelectProfissao/SelectProfissao";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";
import { toastError, toastSuccess } from "@/utils/toastWithSound";
import {
    DrawerFormWrapper, Section, Fieldset, Legend, RadioGroup, RadioOption, ResetIndicacao,
    NameContainer, ContatoContainer, ErrorMessage, SubmitButton, SelectDiv
} from "./CadastroLeadForm.styles";
import api from "@/app/api/axios";
import PhoneInput from "@/app/components/ui/input/PhoneInput";

interface CadastroLeadFormProps {
    onSuccess: () => void;
}

const CadastroLeadForm: React.FC<CadastroLeadFormProps> = ({ onSuccess }) => {
    const dispatch: AppDispatch = useDispatch();

    // 📌 Estados do Formulário
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 📌 Indicação
    const [indicadoPorTipo, setIndicadoPorTipo] = useState<"cliente" | "parceiro" | "">("");
    const [parceirosDisponiveis, setParceirosDisponiveis] = useState<any[]>([]);
    const [indicadosPorParceiros, setIndicadosPorParceiros] = useState<string[]>([]);

    const methods = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            nome: "",
            sobrenome: "",
            genero: "",
            telefone: "",
            email: "",
            profissao_id: "",
            indicado_por_cliente_id: null,
        },
    });

    // *** Pegue os helpers e estados do RHF ***
    const { register, setValue, reset, control, formState: { errors } } = methods;

    // Carrega parceiros ao montar
    useEffect(() => {
        fetchParceiros();
    }, []);

    const fetchParceiros = async () => {
        try {
            const response = await api.get("/parceiros/");
            setParceirosDisponiveis(
                response.data.map((parceiro: any) => ({
                    value: parceiro.id,
                    label: parceiro.nome,
                }))
            );
        } catch (error) {
            toastError("Erro ao carregar parceiros.");
        }
    };

    const handleFormSubmit = async (data: any) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 🔥 Removendo caracteres não numéricos do telefone
            const formattedTelefone = data.telefone.replace(/\D/g, "");

            const leadData: Partial<Cliente> = {
                nome: data.nome,
                sobre_nome: data.sobrenome || undefined,
                genero: data.genero,
                telefone: formattedTelefone,
                email: data.email,
                profissao_id: data.profissao_id || null,
                ...(indicadoPorTipo === "cliente" && data.indicado_por_cliente_id
                    ? { indicado_por_cliente_id: data.indicado_por_cliente_id.value }
                    : {}),
                ...(indicadoPorTipo === "parceiro" && indicadosPorParceiros.length > 0
                    ? { indicado_por_parceiros_ids: indicadosPorParceiros }
                    : {}),
            };

            if (!data.genero) {
                toastError("⚠️ Por favor, selecione um gênero.");
                setIsSubmitting(false);
                return;
            }

            await dispatch(createCliente(leadData)).unwrap();

            toastSuccess("Lead cadastrado com sucesso! 🎉");

            reset();
            onSuccess();
        } catch (error: any) {
            toastError("⚠️ Erro ao cadastrar lead.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DrawerFormWrapper>
            <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
                <Section>
                    <Fieldset>
                        <Legend>Indicação</Legend>
                        <RadioGroup>
                            <RadioOption>
                                <input
                                    type="radio"
                                    name="indicacao"
                                    value="cliente"
                                    checked={indicadoPorTipo === "cliente"}
                                    onChange={() => setIndicadoPorTipo("cliente")}
                                />
                                Cliente
                            </RadioOption>
                            <RadioOption>
                                <input
                                    type="radio"
                                    name="indicacao"
                                    value="parceiro"
                                    checked={indicadoPorTipo === "parceiro"}
                                    onChange={() => setIndicadoPorTipo("parceiro")}
                                />
                                Parceiro
                            </RadioOption>
                            {indicadoPorTipo && (
                                <ResetIndicacao
                                    type="button"
                                    onClick={() => {
                                        setIndicadoPorTipo("");
                                        setIndicadosPorParceiros([]);
                                        setValue("indicado_por_cliente_id", null);
                                    }}
                                >
                                    Cancelar Indicação
                                </ResetIndicacao>
                            )}
                        </RadioGroup>
                        <div>
                            {indicadoPorTipo === "cliente" ? (
                                <SelectCliente
                                    label="Cliente"
                                    name="indicado_por_cliente_id"
                                    control={control}
                                    placeholder="Selecione um cliente"
                                    required
                                    showLabel={false}
                                    errorMessage={errors.indicado_por_cliente_id?.message}
                                />
                            ) : indicadoPorTipo === "parceiro" ? (
                                <Select
                                    options={parceirosDisponiveis}
                                    isMulti
                                    value={parceirosDisponiveis.filter((parceiro) =>
                                        indicadosPorParceiros.includes(parceiro.value)
                                    )}
                                    onChange={(options) =>
                                        setIndicadosPorParceiros(options.map((option: any) => option.value))
                                    }
                                    placeholder="Selecione parceiros..."
                                />
                            ) : null}
                        </div>
                        {errors.indicado_por_cliente_id?.message && (
                            <ErrorMessage>
                                {errors.indicado_por_cliente_id?.message}
                            </ErrorMessage>
                        )}

                    </Fieldset>
                </Section>
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
                        name="sobrenome"
                        type="text"
                        register={register}
                        setValue={setValue}
                        control={control}
                        errorMessage={errors.sobrenome?.message}
                    />
                </NameContainer>
                <ContatoContainer>
                    <PhoneInput
                        name="telefone"
                        label="Telefone"
                        control={control}
                        setValue={setValue}
                        required
                        errorMessage={errors.telefone?.message}
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

                    {errors.genero?.message && <ErrorMessage>{errors.genero?.message}</ErrorMessage>}

                    <SelectProfissao
                        name="profissao_id"
                        control={control}
                        placeholder="Selecione a profissão"
                        showLabel={false}
                        errorMessage={errors.profissao_id?.message}
                    />

                </SelectDiv>
                <SubmitButton
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Lead"}
                </SubmitButton>
            </form>
        </DrawerFormWrapper>
    );
};

export default CadastroLeadForm;
