// 📂 src/components/ApolicesWizard/steps/StepDadosPrincipais.tsx
"use client";

import React from "react";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { StepGrid, FormGroup } from "./StepDadosPrincipais.styles";
import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import {ApoliceFormData} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/ApolicesWizard";
import {loadAdministradoraOptions, loadParceiroOptions} from "@/app/components/ui/select/selectUtils";
import { FaUser, FaBuilding, FaFileAlt, FaCalendarAlt, FaHandshake, FaHashtag } from "react-icons/fa";

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
            {/* Cliente */}
            <FormGroup>
                <SelectCliente
                    name="cliente"
                    label={<><FaUser /> Cliente</>}
                    control={control}
                    required
                    onChange={(selectedOption) => setValue("cliente", selectedOption || null)} // ✅ Agora aceita { value, label }

                />

            </FormGroup>

            {/* Parceiro (Indicação) */}
            <FormGroup>
                <SelectCustom
                    name="parceiro"
                    label={<><FaHandshake /> Parceiro (Indicação)</>}
                    control={control}
                    isAsync={true}
                    loadOptions={loadParceiroOptions}
                />
            </FormGroup>

            {/* Tipo de Apólice */}
            <FormGroup>
                <SelectCustom
                    name="tipoApolice"
                    label={<><FaFileAlt /> Tipo de Apólice</>}
                    options={tipoApoliceOptions}
                    control={control}
                    required
                />
            </FormGroup>

            {/* Administradora */}
            <FormGroup>
                <SelectCustom
                    name="administradora"
                    label={<><FaBuilding /> Administradora</>}
                    control={control}
                    isAsync={true}
                    loadOptions={loadAdministradoraOptions}
                    required
                />
            </FormGroup>

            {/* Número da Apólice */}
            <FormGroup>
                <FloatingMaskedInput
                    name="numeroApolice"
                    label={<><FaHashtag /> Número da Apólice</>}
                    control={control}
                    setValue={setValue}
                    register={register}
                    required
                />
            </FormGroup>

            {/* Datas */}
            <FormGroup>
                <FloatingMaskedInput
                    control={control}
                    name="dataInicio"
                    label={<><FaCalendarAlt /> Data de Início</>}
                    type="date"
                    register={register}
                    setValue={setValue}
                    required
                />
            </FormGroup>

            <FormGroup>
                <FloatingMaskedInput
                    name="dataVencimento"
                    label={<><FaCalendarAlt /> Data de Vencimento</>}
                    type="date"
                    control={control}
                    setValue={setValue}
                    register={register}
                />
            </FormGroup>

            <FormGroup>
                <FloatingMaskedInput
                    control={control}
                    name="dataRevisao"
                    label={<><FaCalendarAlt /> Data de Revisão</>}
                    type="date"
                    register={register}
                    setValue={setValue}
                />
            </FormGroup>
        </StepGrid>
    );
};

export default StepDadosPrincipais;
