// 📂 tipoApolices/PlanoSaude.tsx
import React from 'react';
import { Controller } from "react-hook-form";
import {
    FormGroup,
    Label, StyledInput, StyledSwitch
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(Old Steps)/StepDetalhesApolice.styles";

interface PlanoSaudeProps {
    control: any;
}

const PlanoSaude: React.FC<PlanoSaudeProps> = ({ control }) => {
    return (
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
    );
};

export default PlanoSaude;
