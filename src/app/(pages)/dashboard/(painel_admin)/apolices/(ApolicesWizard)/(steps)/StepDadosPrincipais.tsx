// 📂 src/components/ApolicesWizard/steps/StepDadosPrincipais.tsx
"use client";

import React from "react";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { StepGrid, FormGroup } from "./StepDadosPrincipais.styles";
import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import {ApoliceFormData} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/ApolicesWizard";

interface StepDadosPrincipaisProps {
    control: any;
    setValue: UseFormSetValue<ApoliceFormData>; // ✅ Ajuste aqui para aceitar a tipagem correta
    register: UseFormRegister<ApoliceFormData>;
}


const StepDadosPrincipais: React.FC<StepDadosPrincipaisProps> = ({
                                                                     control,
                                                                     setValue,
                                                                     register,
                                                                 }) => {
    // Opções fixas para Tipo de Apólice
    const tipoApoliceOptions = [
        { value: "plano_saude", label: "Plano de Saúde" },
        { value: "seguro_vida", label: "Seguro de Vida" },
        { value: "consorcio", label: "Consórcio" },
        { value: "previdencia", label: "Previdência" },
        { value: "investimento", label: "Investimento" },
        { value: "seguro_residencial", label: "Seguro Residencial" },
        { value: "seguro_profissional", label: "Seguro Profissional" },
    ];

    return (
        <StepGrid>
            {/* Cliente com SelectCliente (Busca Paginada) */}
            <FormGroup>
                <SelectCliente
                    name="cliente"
                    label="Cliente"
                    control={control}
                    required
                />
            </FormGroup>

            {/* Tipo de Apólice com SelectCustom */}
            <FormGroup>
                <SelectCustom
                    name="tipoApolice"
                    label="Tipo de Apólice"
                    options={tipoApoliceOptions}
                    control={control}
                    required
                />
            </FormGroup>

            {/* Administradora */}
            <FormGroup>
                <FloatingMaskedInput
                    name="administradora"
                    label="Administradora"
                    control={control}
                    setValue={setValue}
                    register={register}
                    required
                />
            </FormGroup>

            {/* Número da Apólice */}
            <FormGroup>
                <FloatingMaskedInput
                    name="numeroApolice"
                    label="Número da Apólice"
                    control={control}
                    setValue={setValue}
                    register={register}
                    required
                />
            </FormGroup>

            {/* Data de Início */}
            <FormGroup>
                <FloatingMaskedInput
                    name="dataInicio"
                    label="Data de Início"
                    type="date"
                    control={control}
                    setValue={setValue}
                    register={register}
                    required
                />
            </FormGroup>

            {/* Data de Vencimento */}
            <FormGroup>
                <FloatingMaskedInput
                    name="dataVencimento"
                    label="Data de Vencimento"
                    type="date"
                    control={control}
                    setValue={setValue}
                    register={register}
                />
            </FormGroup>
        </StepGrid>
    );
};

export default StepDadosPrincipais;
