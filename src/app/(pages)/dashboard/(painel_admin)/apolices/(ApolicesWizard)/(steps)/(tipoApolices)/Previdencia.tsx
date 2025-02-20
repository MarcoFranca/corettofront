import React from 'react';
import {
    FormGroup,
    Label, StyledInput
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(Old Steps)/StepDetalhesApolice.styles";
import {Controller} from "react-hook-form";

interface PrevidenciaProps {
    control: any;
}

const Previdencia: React.FC<PrevidenciaProps> = ({ control }) => {
    return (
        <div>
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
        </div>
    );
};

export default Previdencia;
