// 📂 src/components/ApolicesWizard/steps/StepDetalhesApolice.tsx
"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Input, Switch } from "antd";
import {
    StepContainer,
    FormGroup,
    Label,
    StyledInput,
    StyledSwitch,
} from "./StepDetalhesApolice.styles";

interface StepDetalhesApoliceProps {
    control: any;
    tipoApolice: string;
}

const StepDetalhesApolice: React.FC<StepDetalhesApoliceProps> = ({
                                                                     control,
                                                                     tipoApolice,
                                                                 }) => {
    return (
        <StepContainer>
            {tipoApolice === "plano_saude" && (
            <>
                <FormGroup>
                    <Label>Categoria:</Label>
    <Controller
    name="detalhes.categoria"
    control={control}
    render={({ field }) => <StyledInput {...field} placeholder="Categoria do Plano" />}
    />
    </FormGroup>

    <FormGroup>
    <Label>Coparticipação:</Label>
    <Controller
    name="detalhes.coparticipacao"
    control={control}
    render={({ field }) => <StyledSwitch {...field} />}
    />
    </FormGroup>
    </>
)}

    {tipoApolice === "seguro_vida" && (
        <>
            <FormGroup>
                <Label>Beneficiário:</Label>
    <Controller
        name="detalhes.beneficiario"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Nome do Beneficiário" />}
        />
        </FormGroup>

        <FormGroup>
        <Label>Capital Segurado:</Label>
    <Controller
        name="detalhes.capitalSegurado"
        control={control}
        render={({ field }) => <StyledInput {...field} type="number" placeholder="Valor Segurado" />}
        />
        </FormGroup>
        </>
    )}

    {tipoApolice === "consorcio" && (
        <>
            <FormGroup>
                <Label>Valor da Cota:</Label>
    <Controller
        name="detalhes.valorCota"
        control={control}
        render={({ field }) => <StyledInput {...field} type="number" placeholder="Valor da Cota" />}
        />
        </FormGroup>

        <FormGroup>
        <Label>Grupo:</Label>
    <Controller
        name="detalhes.grupo"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Número do Grupo" />}
        />
        </FormGroup>

        <FormGroup>
        <Label>Cota:</Label>
    <Controller
        name="detalhes.cota"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Número da Cota" />}
        />
        </FormGroup>
        </>
    )}

    {tipoApolice === "previdencia" && (
        <>
            <FormGroup>
                <Label>Nome do Fundo:</Label>
    <Controller
        name="detalhes.nomeFundo"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Nome do Fundo" />}
        />
        </FormGroup>

        <FormGroup>
        <Label>Valor Acumulado:</Label>
    <Controller
        name="detalhes.valorAcumulado"
        control={control}
        render={({ field }) => <StyledInput {...field} type="number" placeholder="Valor Acumulado" />}
        />
        </FormGroup>
        </>
    )}

    {tipoApolice === "investimento" && (
        <FormGroup>
            <Label>Valor Investido:</Label>
    <Controller
        name="detalhes.valorInvestido"
        control={control}
        render={({ field }) => <StyledInput {...field} type="number" placeholder="Valor Investido" />}
        />
        </FormGroup>
    )}

    {tipoApolice === "seguro_residencial" && (
        <FormGroup>
            <Label>Cobertura Adicional:</Label>
    <Controller
        name="detalhes.coberturaAdicional"
        control={control}
        render={({ field }) => <StyledInput {...field} placeholder="Coberturas Extras" />}
        />
        </FormGroup>
    )}

    {tipoApolice === "seguro_profissional" && (
        <FormGroup>
            <Label>Franquia:</Label>
    <Controller
        name="detalhes.franquia"
        control={control}
        render={({ field }) => <StyledInput {...field} type="number" placeholder="Valor da Franquia" />}
        />
        </FormGroup>
    )}
    </StepContainer>
);
};

    export default StepDetalhesApolice;
