// 📂 src/components/ApolicesWizard/ApoliceWizard.tsx
"use client";

import React, { useState } from "react";
import {
    useForm,
    UseFormSetValue,
    Path,
    PathValue
} from "react-hook-form";
import { Steps } from "antd";
import StepDadosPrincipais from "./(steps)/StepDadosPrincipais";
import StepDetalhesApolice from "./(steps)/StepDetalhesApolice";
import StepCoberturas from "./(steps)/StepCoberturas";
import StepResumo from "./(steps)/StepResumo";
import {
    WizardFullContainer,
    StepContainer,
    StepGrid,
    ButtonGroup,
    StyledButton,
    StepTitle,
    StepSubtitle,
} from "./ApoliceWizard.styles";

// ✅ Interface dos dados da apólice
export interface ApoliceFormData {
    cliente: string;
    tipoApolice: string;
    detalhes: Record<string, any>;
    coberturas: { descricao: string; valor: number }[];
}

interface ApoliceWizardProps {
    onClose: () => void;
}

// 📍 Configuração dos Steps
const steps = [
    { title: "Dados Principais", description: "Preencha os dados principais" },
    { title: "Detalhes", description: "Detalhes do plano" },
    { title: "Coberturas", description: "Coberturas para seguro de vida" },
    { title: "Resumo", description: "Revise as informações" },
];

const ApoliceWizard: React.FC<ApoliceWizardProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);

    // ✅ useForm com tipagem correta
    const { handleSubmit, watch, setValue, control, register } = useForm<ApoliceFormData>({
        defaultValues: {
            cliente: "",
            tipoApolice: "",
            detalhes: {},
            coberturas: [],
        },
    });



    const tipoApolice = watch("tipoApolice");

    // ✅ Defina `setTypedValue` com `as` para compatibilizar os tipos
    const setTypedValue: UseFormSetValue<ApoliceFormData> = (
        name,
        value
    ) => {
        setValue(name as Path<ApoliceFormData>, value as PathValue<ApoliceFormData, Path<ApoliceFormData>>);
    };






    const onSubmit = (data: ApoliceFormData) => {
        console.log("Apólice cadastrada:", data);
        onClose();
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    return (
        <WizardFullContainer>
            {/* 🧩 Barra de Progresso (Steps) */}
            <Steps
                current={step}
                items={steps.map(({ title }) => ({
                    title
                }))}
                size="small"
                responsive={true}
            />

            {/* 🧩 Conteúdo das Etapas */}
            <StepContainer>
                {step === 0 && (
                    <>
                        <StepTitle>📂 Dados Principais</StepTitle>
                        <StepSubtitle>Preencha os principais dados da apólice.</StepSubtitle>
                        <StepGrid>
                            <StepDadosPrincipais
                                control={control}
                                setValue={setTypedValue}
                                register={register}
                            />
                        </StepGrid>
                    </>
                )}

                {step === 1 && (
                    <>
                        <StepTitle>📄 Detalhes da Apólice</StepTitle>
                        <StepSubtitle>Informe as especificidades do plano.</StepSubtitle>
                        <StepGrid>
                            <StepDetalhesApolice control={control} tipoApolice={tipoApolice} />
                        </StepGrid>
                    </>
                )}

                {step === 2 && tipoApolice === "seguro_vida" && (
                    <>
                        <StepTitle>💙 Coberturas</StepTitle>
                        <StepSubtitle>Liste as coberturas para o seguro de vida.</StepSubtitle>
                        <StepGrid>
                            <StepCoberturas control={control} />
                        </StepGrid>
                    </>
                )}

                {step === 3 && (
                    <>
                        <StepTitle>✅ Resumo</StepTitle>
                        <StepSubtitle>Revise todas as informações antes de concluir.</StepSubtitle>
                        <StepResumo watch={watch} />
                    </>
                )}
            </StepContainer>

            {/* 🧩 Botões de Navegação */}
            <ButtonGroup>
                {step > 0 && (
                    <StyledButton onClick={handleBack} variant="secondary">
                        Voltar
                    </StyledButton>
                )}
                {step < 3 ? (
                    <StyledButton onClick={handleNext}>Próximo</StyledButton>
                ) : (
                    <StyledButton onClick={handleSubmit(onSubmit)}>
                        Finalizar
                    </StyledButton>
                )}
            </ButtonGroup>
        </WizardFullContainer>
    );
};

export default ApoliceWizard;
