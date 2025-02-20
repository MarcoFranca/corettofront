import React from 'react';
import {
    FormGroup,
    Label,
    StyledInput
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(Old Steps)/StepDetalhesApolice.styles";
import {Controller} from "react-hook-form";

interface InvestimentoProps {
    control: any; // Percentual concluído (0-100)
}

const Investimento: React.FC<InvestimentoProps> = ({ control }) => {
    return (
        <div>
            <FormGroup>
                <Label>Valor Investido:</Label>
                <Controller
                    name="detalhes.valorInvestido"
                    control={control}
                    render={({ field }) => <StyledInput {...field} type="number" placeholder="Valor Investido" />}
                />
            </FormGroup>
        </div>
    );
};

export default Investimento;
