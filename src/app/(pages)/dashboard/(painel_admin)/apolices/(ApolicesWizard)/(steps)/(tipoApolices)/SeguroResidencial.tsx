import React from 'react';

import {Controller} from "react-hook-form";
import {
    FormGroup,
    StyledInput
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/StepDadosPrincipais.styles";
import {Label} from "recharts";

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
