import React from 'react';
import {
    FormGroup,
    Label,
    StyledInput
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(Old Steps)/StepDetalhesApolice.styles";
import {Controller} from "react-hook-form";

interface SeguroResidencialProps {
    control: any; // Percentual concluído (0-100)
}

const SeguroResidencial: React.FC<SeguroResidencialProps> = ({ control }) => {
    return (
        <div>
            <FormGroup>
                <Label>Cobertura Adicional:</Label>
                <Controller
                    name="detalhes.coberturaAdicional"
                    control={control}
                    render={({ field }) => <StyledInput {...field} placeholder="Coberturas Extras" />}
                />
            </FormGroup>
        </div>
    );
};

export default SeguroResidencial;
