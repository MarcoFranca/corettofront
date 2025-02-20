// 📂 tipoApolices/SeguroVida.tsx
import React from 'react';
import { Controller } from "react-hook-form";
import {
    FormGroup,
    Label, StyledInput
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(Old Steps)/StepDetalhesApolice.styles";

interface SeguroVidaProps {
    control: any;
}

const SeguroVida: React.FC<SeguroVidaProps> = ({ control }) => {
    return (
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
    );
};

export default SeguroVida;
