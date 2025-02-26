"use client";

import React, {useState} from "react";
import { useForm, UseFormSetValue, Path, PathValue } from "react-hook-form";
import { message, Steps } from "antd";
import StepDadosPrincipais from "./(steps)/StepDadosPrincipais";
import StepDetalhesApolice from "./(steps)/StepDetalhesApolice";
import StepCoberturas from "./(steps)/StepCoberturas";
import StepResumo from "./(steps)/StepResumo";
import UploadApolice from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/UploadApolice";
import {
    WizardFullContainer,
    StepContainer,
    ButtonGroup,
    StyledButton,

    CustomSteps,
} from "./ApoliceWizard.styles";
import api from "@/app/api/axios";
import {ApoliceFormData, ApoliceWizardProps, moneyFields, tipoApoliceParaEndpoint} from "@/types/ApolicesInterface";
import {formattedDataBase, formattedDataByType} from "@/utils/apoliceData";

const ApoliceWizard: React.FC<ApoliceWizardProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const {
        trigger,
        handleSubmit,
        watch,
        setValue,
        control,
        register,
        formState: { errors } // ✅ Agora está dentro do componente!
    } = useForm<ApoliceFormData>({
        mode: "onSubmit", // 🔥 Valida apenas no envio
        defaultValues: {
            cliente: "",
            tipoApolice: "",
            detalhes: {},
            coberturas: [],
            arquivoApolice: null,
            data_vencimento: undefined,
            data_revisao: undefined,
        }
        });

    const tipoApolice = watch("tipoApolice");

    const setTypedValue: UseFormSetValue<ApoliceFormData> = (name, value) => {
        setValue(name as Path<ApoliceFormData>, value as PathValue<ApoliceFormData, Path<ApoliceFormData>>);
    };

    // 🔥 Função para limpar valores vazios antes do envio
    const formatValue = (value: any) => {
        return value === "" || value === undefined ? null : value;
    };

    const onSubmit = async (data: ApoliceFormData) => {
        setLoading(true);

        try {
            const formData = new FormData();

            // ✅ Obtém os dados base e adiciona os campos específicos baseados no tipo de apólice
            let formattedData = {
                ...formattedDataBase(data),
                ...(data.tipoApolice ? formattedDataByType[data.tipoApolice as keyof typeof formattedDataByType](data) : {}),
            };

            console.log("📡 Enviando apólice...", formattedData);

            // ✅ Adicionamos os beneficiários apenas para Plano de Saúde
            if (
                data.tipoApolice === "Plano de Saúde" &&
                Array.isArray(data.detalhes.beneficiarios) &&
                data.detalhes.beneficiarios.length > 0
            ) {
                (formattedData as any).beneficiarios = JSON.stringify(data.detalhes.beneficiarios); // ✅ Convertido apenas para Plano de Saúde
            }


            // ✅ Adiciona os dados ao `FormData`
            Object.entries(formattedData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
                }
            });

            // ✅ Adiciona o arquivo se existir
            if (data.arquivoApolice instanceof File) {
                console.log("📂 Anexando arquivo:", data.arquivoApolice.name);
                formData.append("arquivo", data.arquivoApolice);
            }

            // ✅ 1. Envia a apólice ao backend (com beneficiários inclusos)
            const response = await api.post(tipoApoliceParaEndpoint[data.tipoApolice as keyof typeof formattedDataByType], formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status !== 201) {
                throw new Error(`Erro ao cadastrar apólice: ${response.status}`);
            }

            console.log("✅ Apólice e Beneficiários cadastrados com sucesso!");
            message.success("Apólice cadastrada com sucesso!");
            onClose();
        } catch (error) {
            console.error("🚨 Erro ao enviar apólice:", error);
            message.error("Erro ao cadastrar apólice.");
        } finally {
            setLoading(false);
        }
    };


    const handleNext = async () => {
        const isValid = await trigger();
        console.log("🔍 Erros antes de avançar:", errors);

        if (!isValid) {
            message.error("Preencha todos os campos obrigatórios antes de continuar.");
            return;
        }

        setStep((prev) => prev + 1);
    };


    const handleBack = () => setStep((prev) => prev - 1);

    // 📌 **Configuração dinâmica dos steps**
    const steps = [
        { title: "Dados Principais", content: <StepDadosPrincipais
                control={control}
                setValue={setTypedValue}
                register={register}
                watch={watch}  // 🔥 Agora passamos `watch` para o componente
                formState={{ errors }} // ✅ Agora os erros são passados corretamente
            />
        },
        { title: "Detalhes", content: <StepDetalhesApolice whatch={watch} control={control} setValue={setValue} register={register} tipoApolice={tipoApolice ?? ""} /> },
    ];

    if (tipoApolice === "Seguro de Vida") {
        steps.push(
            { title: "Coberturas", content: <StepCoberturas control={control} /> },
            { title: "Importação", content: <UploadApolice setValue={setValue} /> }
        );
    } else {
        steps.push({ title: "Importação", content: <UploadApolice setValue={setValue} /> });
    }

    steps.push({ title: "Resumo", content: <StepResumo watch={watch} /> });

    return (
        <WizardFullContainer>
            <CustomSteps current={step} items={steps.map(({ title }) =>
                ({ title }))} size="small" responsive={true} />

            <StepContainer>{steps[step].content}</StepContainer>

            <ButtonGroup>
                {step > 0 && (
                    <StyledButton onClick={handleBack} variant="secondary">
                        Voltar
                    </StyledButton>
                )}
                {step < steps.length - 1 ? (
                    <StyledButton onClick={handleNext}>Próximo</StyledButton>
                ) : (
                    <StyledButton onClick={handleSubmit(onSubmit)}>Finalizar</StyledButton>
                )}
            </ButtonGroup>
        </WizardFullContainer>
    );
};

export default ApoliceWizard;
